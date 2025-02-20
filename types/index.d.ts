import type { EVENT_NAMES } from './constants'

export {}

declare global {

  /**
   * Event sent when researching a company sent from the
   * research post endpoint indicating progress through the
   * research process.
   */
  interface ResearchEvent {
    event: EVENT_NAMES
    data: any
  }
}
