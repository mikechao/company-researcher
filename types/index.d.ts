import type { EVENT_NAMES } from './constants'

export {}

declare global {

  interface ResearchParams {
    companyName: string
    includeSearchResults: boolean
    maxSearchQueries: number
    maxSearchResults: number
    maxReflectionSteps: number
    userNotes: string
    extractionSchema: string
  }

  /**
   * Event sent when researching a company sent from the
   * research post endpoint indicating progress through the
   * research process.
   */
  interface ResearchEvent {
    timestamp: string
    event: EVENT_NAMES
    data: any
  }

  type ResearchParamName = (typeof RESEARCH_PARAM_NAMES)[keyof typeof RESEARCH_PARAM_NAMES]

  /**
   * The research results returned from the research post endpoint.
   *
   * Emitted from the routeFromReflection node in the graph when reflection
   * is satisfactory.
   */
  interface ResearchResults {
    /**
     * A dictionary containing the extracted and processed information
     * based on the user's query and the graph's execution.
     * This is the primary output of the enrichment process.
     */
    info: Record<string, any>
    /**
     * A list of search results if includeSearchResults is true.
     *
     */
    searchResults?: SearchResult[]
  }

  /**
   * Represents the research notes that are generated during the
   * research process. Emitted from the researchCompany node in the graph.
   */
  interface ResearchNotes {
    notes: string[]
  }

  /**
   * Represents the research queries that are generated during the
   * research process. Emitted from the generateQueries node in the graph.
   */
  interface ResearchQueries {
    queries: string[]
  }

  /**
   * Represents a search result that is returned from the
   * researchCompany node in the research process. Is part of
   * the response from the Tavily search API.
   */
  interface SearchResult {
    title: string
    url: string
    content: string
    rawContent?: string
    score: number
  }

  /**
   * Represents a data item that is returned from the
   * research post endpoint. Created from the custom events
   * emitted by the graph during the research process.
   */
  interface DataItem {
    /**
     * A unique identifier for the data item.
     */
    id: string
    /**
     * The name of the custom event that generated this data item.
     */
    name: string
    /**
     * JSON.stringify of the data object that was emitted with the custom event.
     */
    data: string
  }
}
