<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'
import { EVENT_NAMES } from '~/types/constants'

const companyName = ref('Apple')
const includeSearchResults = ref('False')
const includeSearchResultsBoolean = computed(() => includeSearchResults.value === 'True')

const isLoading = ref(false)

const task = ref(0)
// ProgressBar.vue depends on the order of steps
// also needed here because of data, that is send from backend
const steps = [
  'Waiting...',
  EVENT_NAMES.GENERATE_QUERIES,
  EVENT_NAMES.BEFORE_EXECUTE_QUERIES,
  EVENT_NAMES.AFTER_EXECUTE_QUERIES,
  EVENT_NAMES.GENERATE_NOTES,
  EVENT_NAMES.BEFORE_NOTES_TO_SCHEMA,
  EVENT_NAMES.AFTER_NOTES_TO_SCHEMA,
  EVENT_NAMES.BEFORE_REFLECTION,
  EVENT_NAMES.AFTER_REFLECTION,
  EVENT_NAMES.END,
]
const sessionId = uuidv4()
const { data, append } = useChat({
  api: '/api/research',
  body: {
    sessionId,
    company: companyName.value,
    maxSearchQueries: 3,
    maxSearchResults: 3,
    maxReflectionSteps: 0,
    includeSearchResults: includeSearchResultsBoolean.value,
  },
})

async function research() {
  isLoading.value = true
  try {
    // use append to trigger call the research endpoint
    // the message is ignored by the server
    await append(
      { role: 'user', content: 'Hello' },
    )
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
    finished()
  }
}

function finished() {
  isLoading.value = false
}
</script>

<template>
  <UCard class="justify-center h-screen">
    <div class="flex flex-col items-center">
      <div class="flex items-center">
        <label for="company-name" class="mr-2">Company Name</label>
        <UInput
          id="company-name"
          v-model="companyName"
          label="Company Name"
          placeholder="Enter company name"
          color="primary"
          variant="outline"
          :disabled="true"
        />
      </div>
      <div class="flex items-center">
        <label for="include-search-results" class="mt-2">Include Search Results</label>
        <UInputMenu
          id="include-search-results"
          trailing-icon="i-mdi-chevron-down"
          selected-icon="i-mdi-check"
          placeholder="Select a value"
          :options="['True', 'False']"
          class="mt-2"
          v-model="includeSearchResults"
        />
      </div>
      <UButton
        label="Research"
        icon="i-mdi-microscope"
        loading-icon="i-mdi-loading"
        :trailing="true"
        color="primary"
        class="mt-4"
        :loading="isLoading"
        @click="research"
      />
      <ProgressBar
        :value="task"
        :max="steps"
        class="mt-4"
      />
    </div>
  </UCard>
</template>
