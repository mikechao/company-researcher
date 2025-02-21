<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { EVENT_NAMES } from '~/types/constants'

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

const state = reactive({
  companyName: 'Apple',
  includeSearchResults: false,
  maxSearchQueries: 3,
  maxSearchResults: 3,
  maxReflectionSteps: 0,
})

const sessionId = uuidv4()
const { data, append } = useChat({
  api: '/api/research',
  body: {
    sessionId,
    company: state.companyName,
    maxSearchQueries: 3,
    maxSearchResults: 3,
    maxReflectionSteps: 0,
    includeSearchResults: state.includeSearchResults,
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
const schema = z.object({
  companyName: z.string().describe('The name of the company to research'),
  includeSearchResults: z.boolean()
    .optional()
    .default(false)
    .describe('Whether to include search results in the research result'),
  maxSearchQueries: z.number()
    .min(1, {message: "Must be at least 1 query"})
    .max(5, {message: "Cannot exceed 5 queries"})
    .int({message: "Must be a whole number"})
    .optional()
    .default(3)
    .describe('The maximum number of search queries to generate'),
  maxSearchResults: z.number()
    .min(1, {message: "Must be at least 1 result"})
    .max(5, {message: "Cannot exceed 5 results"})
    .int({message: "Must be a whole number"})
    .optional()
    .default(3)
    .describe('The maximum number of search results to include'),
  maxReflectionSteps: z.number()
    .min(0, {message: "Cannot be negative"})
    .max(3, {message: "Cannot exceed 3 steps"})
    .int({message: "Must be a whole number"})
    .optional()
    .default(0)
    .describe('The maximum number of reflection steps to take'),
})

</script>

<template>
  <UCard class="justify-center h-screen">
    <UForm :schema="schema" :state="state" class="space-y-2 w-fit" @submit="research">
      <UFormGroup 
        label="Company Name" 
        name="companyName"
        required
      >
        <UInput
          v-model="state.companyName"
          placeholder="Enter company name"
          color="primary"
          variant="outline"
        />
      </UFormGroup>
      <UDivider/>
      <UFormGroup label="Include Search Results" name="includeSearchResults">
        <UToggle
          v-model="state.includeSearchResults"
          color="primary"
          :true-label="'Yes'"
          :false-label="'No'"
        />
      </UFormGroup>
      <UDivider/>
      <UFormGroup label="Max Search Queries" name="maxSearchQueries">
        <UInput
          v-model="state.maxSearchQueries"
          type="number"
          color="primary"
          variant="outline"
          :min="1"
          :max="5"
          step="1"
        />
        <URange
          v-model="state.maxSearchQueries"
          color="primary"
          :min="1"
          :max="5"
          class="mt-1"
        />
      </UFormGroup>
      <UDivider/>
      <UFormGroup label="Max Search Results" name="maxSearchResults">
        <UInput
          v-model="state.maxSearchResults"
          type="number"
          color="primary"
          variant="outline"
          :min="1"
          :max="5"
          step="1"
        />
        <URange
          v-model="state.maxSearchResults"
          color="primary"
          :min="1"
          :max="5"
          class="mt-1"
        />
      </UFormGroup>
      <UDivider/>
      <UFormGroup label="Number of Reflection Steps" name="maxReflectionSteps">
        <UInput
          v-model="state.maxReflectionSteps"
          type="number"
          color="primary"
          variant="outline"
          :min="0"
          :max="3"
          step="1"
        />
        <URange
          v-model="state.maxReflectionSteps"
          color="primary"
          :min="0"
          :max="3"
          class="mt-1"
        />

      </UFormGroup>
      <UDivider/>
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
    </UForm>
    <div class="flex flex-col items-center">
      <ProgressBar
        :value="task"
        :max="steps"
        class="mt-4"
      />
    </div>
  </UCard>
</template>
