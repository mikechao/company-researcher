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
const chatBody = computed(() => ({
  sessionId,
  company: state.companyName,
  maxSearchQueries: state.maxSearchQueries,
  maxSearchResults: state.maxSearchResults,
  maxReflectionSteps: state.maxReflectionSteps,
  includeSearchResults: state.includeSearchResults,
}))

const { data, append } = useChat({
  api: '/api/test',
  body: chatBody,
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
    finished(data)
  }
}

const results = ref('')
const showResults = ref(false)
function finished(dataItem: DataItem) {
  results.value = extractData(dataItem.data)
  showResults.value = true
  isLoading.value = false
}
function extractData(data: any) {
  if ('data' in data && 'info' in data.data) {
    return data.data.info
  }
  console.warn('No info found in data:', data)
  return JSON.stringify(data, null, 2)
}
const schema = z.object({
  companyName: z.string().describe('The name of the company to research'),
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
  <UCard class="justify-center h-screen">
    <Transition name="slide-fade">
      <div v-show="showResults" class="mb-2 flex justify-center">
        <ResearchResults :data="results" :is-root="true" class="w-[800px]" />
      </div>
    </Transition>

    <Transition name="collapse">
      <div v-show="!showResults" class="flex justify-center">
        <div class="w-[800px]">
          <UForm :schema="schema" :state="state" class="flex flex-wrap gap-3" @submit="research">
            <!-- Company name section -->
            <div class="w-full flex justify-center mb-4">
              <div class="flex-1">
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
              </div>
            </div>

            <div class="min-w-fit">
              <UFormGroup label="Include Search Results" name="includeSearchResults">
                <UToggle
                  v-model="state.includeSearchResults"
                  color="primary"
                />
              </UFormGroup>
            </div>

            <div class="min-w-fit">
              <NumberInput
                v-model="state.maxSearchQueries"
                label="Max Search Queries"
                name="maxSearchQueries"
                :min="1"
                :max="5"
              />
            </div>

            <div class="min-w-fit">
              <NumberInput
                v-model="state.maxSearchResults"
                label="Max Search Results"
                name="maxSearchResults"
                :min="1"
                :max="5"
              />
            </div>

            <div class="min-w-fit">
              <NumberInput
                v-model="state.maxReflectionSteps"
                label="Number of Reflection Steps"
                name="maxReflectionSteps"
                :min="0"
                :max="3"
              />
            </div>

            <!-- Button section -->
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
        </div>
      </div>
    </Transition>
  </UCard>
</template>

<style scoped>
/* Slide down animation for results */
.slide-fade-enter-active {
  transition: all 1.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Form minimize animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 1s ease;
}
</style>
