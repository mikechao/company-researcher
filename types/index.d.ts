import type { EVENT_NAMES } from './constants'

export {}

declare global {

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
