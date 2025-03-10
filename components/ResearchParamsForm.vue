<!-- filepath: /home/mikechao/projects/vue/company-researcher/components/research/ResearchForm.vue -->
<script setup lang="ts">
import { UFormField, USwitch } from '#components'
import { z } from 'zod'
import { defaultExtractionSchema, RESEARCH_PARAM_NAMES } from '~/types/constants'

const props = defineProps<{
  isLoading: boolean
}>()
const emit = defineEmits<{
  research: [void]
  openSchemaEditor: [void]
}>()
const ResearchParamHelp = defineAsyncComponent(() => import('~/components/ResearchParamHelp.vue'))
const NumberInput = defineAsyncComponent(() => import('~/components/NumberInput.vue'))

const hoveredField = ref<ResearchParamName | null>(null)

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

const formEnabled = computed(() => !props.isLoading)

function submitForm() {
  emit('research')
}

function openSchemaEditor() {
  emit('openSchemaEditor')
}

defineExpose({
  state,
  reset: () => Object.assign(state, defaultState),
})
</script>

<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-wrap gap-3 p-6 shadow-md rounded-md app-ring"
      @submit="submitForm"
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
            class="cursor-pointer"
            @click="openSchemaEditor"
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
          class="mt-4 cursor-pointer"
          :loading="isLoading"
          type="submit"
        />
      </div>
    </UForm>

    <div class="h-[120px]">
      <ResearchParamHelp
        v-if="hoveredField"
        :param-name="hoveredField"
      />
    </div>
  </div>
</template>
