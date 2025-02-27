<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import ResearchParamHelp from '~/components/ResearchParamHelp.vue'
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

const state: ResearchParams = reactive({
  ...defaultState,
})

const sessionId = uuidv4()

const { data, append, messages } = useChat({
  api: runtimeConfig.public.endPoint,
  body: computed(() => ({
    sessionId,
    ...state,
    company: state.companyName,
    extractionSchema: JSON.parse(state.extractionSchema),
    messages: messages.value.length > 0 ? [messages.value[messages.value.length - 1]] : [],
  })),
  onResponse: (response) => {
    // eslint-disable-next-line no-console
    console.log('Response:', response)
  },
  onFinish: (message) => {
    // eslint-disable-next-line no-console
    console.log('onFinish', message)
    if (message.content !== EVENT_NAMES.END) {
      append({ role: 'user', content: 'continue' })
    }
  },
})

async function research() {
  isLoading.value = true
  try {
    await append(
      { role: 'user', content: 'init' },
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
  <div class="h-full p-4">
    <transition-expand :duration="1000">
      <div v-show="showResults" class="mb-2 flex justify-center">
        <ResearchResults
          v-if="results"
          :data="results"
          @restart="restart"
        />
      </div>
    </transition-expand>

    <transition-expand :duration="1000">
      <div v-show="!showResults" class="flex justify-center">
        <div class="w-[800px]">
          <UForm
            :schema="schema"
            :state="state"
            class="flex flex-wrap gap-3 p-6 shadow-md rounded-md app-ring"
            @submit="research"
          >
            <!-- Company name section -->
            <div class="w-full flex justify-center mb-4">
              <div class="flex-1">
                <UFormGroup
                  label="Company Name"
                  :name="RESEARCH_PARAM_NAMES.COMPANY_NAME"
                  required
                  @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.COMPANY_NAME"
                  @mouseleave="hoveredField = null"
                >
                  <UInput
                    v-model="state.companyName"
                    placeholder="Enter company name"
                    color="primary"
                    variant="outline"
                    :disabled="!formEnabled"
                  />
                </UFormGroup>
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

            <div class="min-wit">
              <UFormGroup
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
              </UFormGroup>
            </div>

            <div class="min-w-fit">
              <UFormGroup
                label="Search Results"
                :name="RESEARCH_PARAM_NAMES.INCLUDE_SEARCH_RESULTS"
                @mouseenter="hoveredField = RESEARCH_PARAM_NAMES.INCLUDE_SEARCH_RESULTS"
                @mouseleave="hoveredField = null"
              >
                <UToggle
                  v-model="state.includeSearchResults"
                  color="primary"
                  on-icon="i-mdi-thumb-up-outline"
                  off-icon="i-mdi-thumb-down-outline"
                  size="lg"
                  :disabled="!formEnabled"
                />
              </UFormGroup>
            </div>

            <div class="min-w-fit">
              <UFormGroup
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
              </UFormGroup>
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
