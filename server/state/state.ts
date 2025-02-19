import { Annotation } from '@langchain/langgraph'

export const defaultExtractionSchema: Record<string, any> = {
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
}

/**
 * Have OverallState and InputState share extraction schema
 * so we do not get the error
 *
 * Channel "extractionSchema" already exists with a different type
 */
const sharedExtractionSchema = Annotation<string>({
  reducer: (_state: string, update: string) => update,
  default: () => JSON.stringify(defaultExtractionSchema, null, 2),
})

const sharedSearchResult = Annotation<Record<string, any>[]>({
  reducer: (state: Record<string, any>[], update: Record<string, any>[]) => {
    state.push(...update)
    return state
  },
  default: () => [],
})

/**
 * Input state defines the interface between the graph and the user (external API).
 */
export const OverallState = Annotation.Root({
  /**
   * Company to research provided by the user.
   */
  company: Annotation<string>(),
  /**
   * The json schema defines the information the agent is tasked with filling out.
   */
  extractionSchema: sharedExtractionSchema,
  /**
   * Any notes from the user to start the research process.
   */
  userNotes: Annotation<string>(),
  /**
   * List of generated search queries to find relevant information
   */
  searchQueries: Annotation<string[]>({
    reducer: (state: string[], update: string[]) => {
      state.push(...update)
      return state
    },
    default: () => [],
  }),
  /**
   * List of search results
   */
  searchResult: sharedSearchResult,
  /**
   * Notes from completed research related to the schema
   */
  completedNotes: Annotation<string[]>({
    reducer: (state: string[], update: string[]) => {
      state.push(...update)
      return state
    },
    default: () => [],
  }),
  /**
   * A dictionary containing the extracted and processed information
   * based on the user's query and the graph's execution.
   * This is the primary output of the enrichment process.
   */
  info: Annotation<Record<string, any>>(),
  /**
   * True if all required fields are well populated, False otherwise
   */
  isSatisfactory: Annotation<boolean>(),
  /**
   * Number of times the reflection node has been executed
   */
  reflectionStepsTaken: Annotation<number>({
    reducer: (_state: number, update: number) => update,
    default: () => 0,
  }),
})

/**
 * Input state defines the interface between the graph and the user (external API).
 */
export const InputState = Annotation.Root({
  /**
   * Company to research provided by the user.
   */
  company: Annotation<string>(),
  /**
   * The json schema defines the information the agent is tasked with filling out.
   */
  extractionSchema: sharedExtractionSchema,
  /**
   * Any notes from the user to start the research process.
   */
  userNotes: Annotation<string>(),
})

export const OutputState = Annotation.Root({
  /**
   * List of search results
   */
  searchResult: sharedSearchResult,
  /**
   * A dictionary containing the extracted and processed information
   * based on the user's query and the graph's execution.
   * This is the primary output of the enrichment process.
   */
  info: Annotation<Record<string, any>>(),
})
