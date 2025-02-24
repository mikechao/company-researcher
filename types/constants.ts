export const EVENT_NAMES = Object.freeze({
  GENERATE_QUERIES: 'generateQueries',
  BEFORE_EXECUTE_QUERIES: 'beforeExecuteQueries',
  AFTER_EXECUTE_QUERIES: 'afterExecuteQueries',
  GENERATE_NOTES: 'generateNotes',
  BEFORE_NOTES_TO_SCHEMA: 'beforeNotesToSchema',
  AFTER_NOTES_TO_SCHEMA: 'afterNotesToSchema',
  BEFORE_REFLECTION: 'beforeReflection',
  AFTER_REFLECTION: 'afterReflection',
  END: 'END',
  REROUTE: 'reroute',
} as const)

/**
 * constants used in UFormGroup name and hoveredField
 * and ResearchParamHelp
 */
export const RESEARCH_PARAM_NAMES = Object.freeze({
  COMPANY_NAME: 'companyName',
  MAX_SEARCH_QUERIES: 'maxSearchQueries',
  MAX_SEARCH_RESULTS: 'maxSearchResults',
  MAX_REFLECTION_STEPS: 'maxReflectionSteps',
  USER_NOTES: 'userNotes',
  INCLUDE_SEARCH_RESULTS: 'includeSearchResults',
  REPORT_SCHEMA: 'reportSchema',
} as const)

export const defaultExtractionSchema: Record<string, any> = Object.freeze({
  title: 'CompanyInfo',
  description: 'Basic information about a company',
  type: 'object',
  properties: {
    company_name: {
      type: 'string',
      description: 'Official name of the company',
    },
    founding_year: {
      type: 'integer',
      description: 'Year the company was founded',
    },
    founder_names: {
      type: 'array',
      items: { type: 'string' },
      description: 'Names of the founding team members',
    },
    product_description: {
      type: 'string',
      description: 'Brief description of the company\'s main product or service',
    },
    funding_summary: {
      type: 'string',
      description: 'Summary of the company\'s funding history',
    },
  },
  required: ['company_name'],
})
