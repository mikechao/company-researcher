import { EVENT_NAMES } from '~/types/constants'

export const useResearchResultsStore = defineStore('researchResult', () => {
  // ProgressBar.vue depends on the order of steps
// also needed here because of data, that is send from backend
  const steps = [
    'Waiting to start...',
    EVENT_NAMES.GENERATED_QUERIES,
    EVENT_NAMES.EXECUTED_QUERIES,
    EVENT_NAMES.GENERATED_NOTES,
    EVENT_NAMES.NOTES_TO_SCHEMA,
    EVENT_NAMES.REFLECTION,
    EVENT_NAMES.END,
  ]

  const task = ref(0)
  const researchResult = ref<ResearchResults>()
  const researchNotes = ref<ResearchNotes>()

  const processedData = new Set()

  function processData(data: DataItem) {
    if (!data || processedData.has(data.id)) {
      return
    }
    processedData.add(data.id)
    task.value = steps.indexOf(data.name)
    if (data.name === EVENT_NAMES.GENERATED_NOTES) {
      researchNotes.value = extractResearchNotes(data.data)
    }
    if (data.name === EVENT_NAMES.END) {
      researchResult.value = extractResearchResults(data.data)
    }
  }

  function extractResearchResults(data: any) {
    if ('data' in data && data.data) {
      return data.data as unknown as ResearchResults
    }
    console.warn('No research results found in data:', data)
    return undefined
  }

  function extractResearchNotes(data: any) {
    if ('data' in data && data.data) {
      return data.data as unknown as ResearchNotes
    }
    console.warn('No research notes found in data:', data)
    return undefined
  }

  function reset() {
    task.value = 0
    researchResult.value = undefined
    researchNotes.value = undefined
    processedData.clear()
  }

  return {
    task,
    researchResult,
    researchNotes,
    processData,
    reset,
  }
})
