export const EVENT_NAMES = Object.freeze({
  GENERATED_QUERIES: 'generatedQueries',
  EXECUTED_QUERIES: 'executedQueries',
  GENERATED_NOTES: 'generatedNotes',
  NOTES_TO_SCHEMA: 'notesToSchema',
  REFLECTION: 'reflection',
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

export const complexSchema: Record<string, any> = Object.freeze({
  title: 'CompanyInfo',
  description: 'Comprehensive information about a company with confidence tracking',
  type: 'object',
  properties: {
    company_name: {
      type: 'string',
      description: 'Official name of the company',
    },
    verified_company: {
      type: 'boolean',
      description: 'Confirmation this is the intended company, not a similarly named one',
    },
    similar_companies: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of similarly named companies that could be confused with the target',
    },
    distinguishing_features: {
      type: 'string',
      description: 'Key features that distinguish this company from similarly named ones',
    },
    key_executives: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          title: { type: 'string' },
          verification_date: { type: 'string' },
          confidence_level: {
            type: 'string',
            enum: ['high', 'medium', 'low', 'uncertain'],
          },
          source: { type: 'string' },
        },
      },
    },
    org_chart_summary: {
      type: 'string',
      description: 'Brief description of organizational structure',
    },
    leadership_caveats: {
      type: 'string',
      description: 'Any uncertainties or caveats about leadership information',
    },
    main_products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          launch_date: { type: 'string' },
          current_status: { type: 'string' },
        },
      },
    },
    services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          target_market: { type: 'string' },
        },
      },
    },
    recent_developments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          source_url: { type: 'string' },
          significance: { type: 'string' },
        },
      },
      description: 'Major news and developments from the last 6 months',
    },
    historical_challenges: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          issue_type: { type: 'string' },
          description: { type: 'string' },
          date_period: { type: 'string' },
          resolution: { type: 'string' },
          current_status: { type: 'string' },
        },
      },
      description: 'Past challenges, issues, or controversies',
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          title: { type: 'string' },
          date_accessed: { type: 'string' },
          information_type: {
            type: 'array',
            items: { type: 'string' },
            description: 'Types of information sourced from this link (e.g., leadership, products, news)',
          },
        },
      },
    },
    company_summary: {
      type: 'string',
      description: 'Concise, dense summary of the most important company information (max 250 words)',
    },
  },
  required: [
    'company_name',
    'verified_company',
    'company_summary',
    'key_executives',
    'main_products',
    'sources',
  ],
})
