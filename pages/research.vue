<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'

import { timestamp } from '~/composables/timestampString'
import { useResearchResultsStore } from '~/stores/researchResultsStore'
import { EVENT_NAMES } from '~/types/constants'

const ResearchParamHelp = defineAsyncComponent(() => import('~/components/ResearchParamHelp.vue'))
const SchemaEditor = defineAsyncComponent(() => import('~/components/SchemaEditor.vue'))
const ResearchResults = defineAsyncComponent(() => import('~/components/results/ResearchResults.vue'))
const ResearchForm = defineAsyncComponent(() => import('~/components/ResearchParamsForm.vue'))
const ProgressBar = defineAsyncComponent(() => import('~/components/ProgressBar.vue'))

const isLoading = ref(false)
const isSchemaEditorOpen = ref(false)
const hoveredField = ref<ResearchParamName | null>(null)
const runtimeConfig = useRuntimeConfig()
const researchResultsStore = useResearchResultsStore()
const formRef = ref<InstanceType<typeof ResearchForm> | null>(null)

const extractionSchema = computed({
  get: () => formRef.value?.state.extractionSchema ?? '',
  set: (value) => {
    if (formRef.value)
      formRef.value.state.extractionSchema = value
  },
})

const company = computed(() => formRef.value?.state.companyName)

const { researchResult } = storeToRefs(researchResultsStore)

const sessionId = uuidv4()

const { data, input, handleSubmit } = useChat({
  api: runtimeConfig.public.endPoint,
  experimental_prepareRequestBody: ({ messages }) => {
    const state = formRef.value?.state || {}
    return {
      sessionId,
      ...state,
      company,
      extractionSchema: JSON.parse(extractionSchema.value),
      message: messages[messages.length - 1],
    }
  },
  onError(error: Error) {
    handleError(error)
  },
  onFinish: async (message) => {
    if (isLoading.value) {
      if (message.content !== EVENT_NAMES.END) {
        // send a message back to the backend to continue the graph
        input.value = `${message.content} ${timestamp()}`
        handleSubmit()
      }
    }
  },
})

function handleError(error: Error) {
  isLoading.value = false
  console.error('Error:', error)
  // error.message is a JSON string, not sure why

  let errorObj: { statusCode?: number, message?: string } = {}

  try {
    errorObj = JSON.parse(error.message)
  }
  catch {
    // If parsing fails, use empty object
  }

  const statusCode = errorObj?.statusCode ?? 500
  const message = errorObj?.message ?? 'An error occurred while processing the request'

  // Show error page
  showError({ statusCode, message })
}

async function research() {
  isLoading.value = true
  try {
    input.value = 'init'
    handleSubmit()
  }
  catch (error: any) {
    console.error('Error:', error.data || error.message)
    isLoading.value = false
  }
}

watch (data, (newData) => {
  if (newData && newData.length) {
    // this gets call a lot as part of ai-sdk/vue
    const lastData = newData[newData.length - 1] as unknown as DataItem
    processData(lastData)
  }
})

const showResults = ref(false)

function processData(data: DataItem) {
  researchResultsStore.processData(data)
  if (data.name === EVENT_NAMES.END) {
    showResults.value = true
    isLoading.value = false
  }
}

function restart() {
  showResults.value = false
  formRef.value?.reset()
  researchResultsStore.reset()
}

onBeforeRouteLeave(() => {
  restart()
})
</script>

<template>
  <div class="relative flex h-full w-full justify-center bg-dark-50 dark:bg-dark-950 mt-4">
    <div v-show="showResults" class="mb-2 flex justify-center w-full">
      <ResearchResults
        v-if="researchResult"
        :data="researchResult"
        @restart="restart"
      />
    </div>

    <div v-show="!showResults" class="flex flex-col">
      <ResearchForm
        ref="formRef"
        :is-loading="isLoading"
        @research="research"
        @open-schema-editor="isSchemaEditorOpen = true"
      />
      <div class="flex justify-center">
        <ProgressBar
          :value="researchResultsStore.task"
          class="mt-4"
        />
      </div>
      <div class="h-[120px]">
        <ResearchParamHelp
          v-if="hoveredField"
          :param-name="hoveredField"
        />
      </div>
    </div>
  </div>
  <SchemaEditor
    v-if="isSchemaEditorOpen"
    v-model="extractionSchema"
    :is-open="isSchemaEditorOpen"
    @close="isSchemaEditorOpen = false"
  />
</template>
