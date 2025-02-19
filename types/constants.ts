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
