<script setup lang="ts">
import { UFormField, USwitch } from '#components'
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import ResearchParamHelp from '~/components/ResearchParamHelp.vue'
import { timestamp } from '~/composables/timestampString'
import { defaultExtractionSchema, EVENT_NAMES, RESEARCH_PARAM_NAMES } from '~/types/constants'

const SchemaEditor = defineAsyncComponent(() => import('~/components/SchemaEditor.vue'))
const ResearchResults = defineAsyncComponent(() => import('~/components/results/ResearchResults.vue'))

const isLoading = ref(false)
const isSchemaEditorOpen = ref(false)
const task = ref(0)
const hoveredField = ref<ResearchParamName | null>(null)
const runtimeConfig = useRuntimeConfig()

// ProgressBar.vue depends on the order of steps
// also needed here because of data, that is send from backend
const steps = [
  'Waiting to start...',
  EVENT_NAMES.GENERATED_QUERIES,
  EVENT_NAMES.EXECUTED_QUERIES,
  EVENT_NAMES.GENERATED_NOTES,
  EVENT_NAMES.NOTES_TO_SCHEMA,
  EVENT_NAMES.REFLECTION,
  EVENT_NAMES.END,
]

interface ResearchParams {
  companyName: string
  includeSearchResults: boolean
  maxSearchQueries: number
  maxSearchResults: number
  maxReflectionSteps: number
  userNotes: string
  extractionSchema: string
}

const defaultState = Object.freeze({
  companyName: '',
  includeSearchResults: false,
  maxSearchQueries: 3,
  maxSearchResults: 3,
  maxReflectionSteps: 0,
  userNotes: '',
  extractionSchema: JSON.stringify(defaultExtractionSchema, null, 2),
} satisfies ResearchParams)

const state = reactive<ResearchParams>({
  ...defaultState,
})

const sessionId = uuidv4()

const { data, input, handleSubmit } = useChat({
  api: runtimeConfig.public.endPoint,
  experimental_prepareRequestBody: ({ messages }) => {
    return {
      sessionId,
      ...state,
      company: state.companyName,
      extractionSchema: JSON.parse(state.extractionSchema),
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

const processedData = new Set()
function processData(data: DataItem) {
  if (!data || processedData.has(data.id)) {
    return
  }
  processedData.add(data.id)
  task.value = steps.indexOf(data.name)
  if (data.name === EVENT_NAMES.END) {
    finished(data)
  }
}

const results = ref<ResearchResults>()
const showResults = ref(false)
const formEnabled = computed(() => !isLoading.value)

function finished(dataItem: DataItem) {
  results.value = extractData(dataItem.data)
  showResults.value = true
  isLoading.value = false
}

function extractData(data: any) {
  if ('data' in data) {
    return data.data as ResearchResults
  }
  console.warn('No info found in data:', data)
}

function restart() {
  showResults.value = false
  Object.assign(state, defaultState)
  results.value = undefined
  processedData.clear()
  task.value = 0
}

const schema = z.object({
  companyName: z.string()
    .nonempty({ message: 'Company name cannot be empty' })
    .describe('The name of the company to research'),
  includeSearchResults: z.boolean()
    .optional()
    .default(false)
    .describe('Whether to include search results in the research result'),
  maxSearchQueries: z.number()
    .min(1, { message: 'Must be at least 1 query' })
    .max(5, { message: 'Cannot exceed 5 queries' })
    .int({ message: 'Must be a whole number' })
    .optional()
    .default(3)
    .describe('The maximum number of search queries to generate'),
  maxSearchResults: z.number()
    .min(1, { message: 'Must be at least 1 result' })
    .max(5, { message: 'Cannot exceed 5 results' })
    .int({ message: 'Must be a whole number' })
    .optional()
    .default(3)
    .describe('The maximum number of search results to include'),
  maxReflectionSteps: z.number()
    .min(0, { message: 'Cannot be negative' })
    .max(3, { message: 'Cannot exceed 3 steps' })
    .int({ message: 'Must be a whole number' })
    .optional()
    .default(0)
    .describe('The maximum number of reflection steps to take'),
})
</script>

<template>
  <div class="relative flex h-full w-full justify-center bg-dark-50 dark:bg-dark-950">
    <transition-expand :duration="1000">
      <div v-show="showResults" class="mb-2 flex justify-center w-full">
        <ResearchResults
          v-if="results"
          :data="results"
          @restart="restart"
        />
      </div>
    </transition-expand>

    <transition-expand :duration="1000">
      <div v-show="!showResults" class="flex flex-col">
        <UForm
          :schema="schema"
          :state="state"
          class="flex flex-wrap gap-3 p-6 shadow-md rounded-md app-ring"
          @submit="research"
        >
          <!-- Company name section -->
          <div class="w-full flex justify-center mb-4">
            <div class="flex-1">
              <UFormField
                label="Company Name"
                :name="RESEARCH_PARAM_NAMES.COMPANY_NAME"
                required
                @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.COMPANY_NAME"
                @mouseleave="hoveredField = null"
              >
                <UInput
                  v-model="state.companyName"
                  placeholder="Enter company name"
                  class="w-full"
                  color="primary"
                  variant="outline"
                  :disabled="!formEnabled"
                />
              </UFormField>
            </div>
          </div>

          <div class="min-w-fit">
            <NumberInput
              v-model="state.maxSearchQueries"
              label="Search Queries"
              :name="RESEARCH_PARAM_NAMES.MAX_SEARCH_QUERIES"
              :min="1"
              :max="5"
              :default-value="defaultState.maxSearchQueries"
              :disable="!formEnabled"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.MAX_SEARCH_QUERIES"
              @mouseleave="hoveredField = null"
            />
          </div>

          <div class="min-w-fit">
            <NumberInput
              v-model="state.maxSearchResults"
              label="Search Results"
              :name="RESEARCH_PARAM_NAMES.MAX_SEARCH_RESULTS"
              :min="1"
              :max="5"
              :default-value="defaultState.maxSearchResults"
              :disable="!formEnabled"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.MAX_SEARCH_RESULTS"
              @mouseleave="hoveredField = null"
            />
          </div>

          <div class="min-w-fit">
            <NumberInput
              v-model="state.maxReflectionSteps"
              label="Reflection Steps"
              :name="RESEARCH_PARAM_NAMES.MAX_REFLECTION_STEPS"
              :min="0"
              :max="3"
              :default-value="defaultState.maxReflectionSteps"
              :disable="!formEnabled"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.MAX_REFLECTION_STEPS"
              @mouseleave="hoveredField = null"
            />
          </div>

          <div class="min-w-fit">
            <UFormField
              label="User Notes"
              :name="RESEARCH_PARAM_NAMES.USER_NOTES"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.USER_NOTES"
              @mouseleave="hoveredField = null"
            >
              <UTextarea
                v-model="state.userNotes"
                placeholder="Enter notes"
                color="primary"
                variant="outline"
                :disabled="!formEnabled"
              />
            </UFormField>
          </div>

          <div class="min-w-fit">
            <UFormField
              label="Search Results"
              :name="RESEARCH_PARAM_NAMES.INCLUDE_SEARCH_RESULTS"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.INCLUDE_SEARCH_RESULTS"
              @mouseleave="hoveredField = null"
            >
              <USwitch
                v-model="state.includeSearchResults"
                color="primary"
                checked-icon="i-mdi-thumb-up-outline"
                unchecked-icon="i-mdi-thumb-down-outline"
                size="lg"
                :disabled="!formEnabled"
              />
            </UFormField>
          </div>

          <div class="min-w-fit">
            <UFormField
              label="Report Schema"
              :name="RESEARCH_PARAM_NAMES.REPORT_SCHEMA"
              @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.REPORT_SCHEMA"
              @mouseleave="hoveredField = null"
            >
              <UButton
                label="Edit"
                icon="i-mdi-application-edit"
                :trailing="true"
                color="primary"
                :disabled="!formEnabled"
                @click="isSchemaEditorOpen = true"
              />
            </UFormField>
          </div>

          <div class="w-full flex justify-center">
            <UButton
              label="Research"
              icon="i-mdi-microscope"
              loading-icon="i-mdi-loading"
              :trailing="true"
              color="primary"
              class="mt-4"
              :loading="isLoading"
              type="submit"
            />
          </div>
        </UForm>
        <div class="flex justify-center">
          <ProgressBar
            :value="task"
            :max="steps"
            class="mt-4"
          />
        </div>
        <div class="h-[120px]">
          <transition-fade>
            <ResearchParamHelp
              v-if="hoveredField"
              :param-name="hoveredField"
            />
          </transition-fade>
        </div>
      </div>
    </transition-expand>
  </div>
  <SchemaEditor
    v-if="isSchemaEditorOpen"
    v-model="state.extractionSchema"
    :is-open="isSchemaEditorOpen"
    @close="isSchemaEditorOpen = false"
  />
</template>
