import type { RunnableConfig } from '@langchain/core/runnables'
import type { TavilySearchResponse } from '@tavily/core'
import { ChatAnthropic } from '@langchain/anthropic'
import { PromptTemplate } from '@langchain/core/prompts'
import { END, START, StateGraph } from '@langchain/langgraph'
import { tavily } from '@tavily/core'
import { consola } from 'consola'
import { z } from 'zod'
import { EXTRACTION_PROMPT, INFO_PROMPT, QUERY_WRITER_PROMPT, REFLECTION_PROMPT } from '../prompts/prompts'
import { ConfigurableAnnotation, getConfig } from '../state/configuration'
import { InputState, OutputState, OverallState } from '../state/state'
import { deduplicateSources } from '../utils/deduplicateSources'
import { formatAllNotes } from '../utils/formatNotes'
import { formatSource } from '../utils/formatSources'

export default defineLazyEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const model = new ChatAnthropic({
    anthropicApiKey: runtimeConfig.anthropicAPIKey,
    model: 'claude-3-5-sonnet-latest',
  })

  const tavilyClient = tavily({
    apiKey: runtimeConfig.tavilyAPIKey,
  })

  const generateQueries = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
    const before = performance.now()
    const maxSearchQueries = config.configurable?.maxSearchQueries

    const querySchema = z.object({
      queries: z.array(z.string()).describe('List of search queries.'),
    })

    const structuredModel = model.withStructuredOutput(querySchema)
    const queryInstructions = await PromptTemplate.fromTemplate(QUERY_WRITER_PROMPT)
      .format({
        company: state.company,
        max_search_queries: maxSearchQueries,
        info: JSON.stringify(state.extractionSchema, null, 2),
        user_notes: state.userNotes,
      })

    const results = await structuredModel.invoke([
      { role: 'system', content: queryInstructions },
      {
        role: 'user',
        content: 'Please generate a list of search queries related to the schema that you want to populate.',
      },
    ])
    const after = performance.now()
    consola.debug({ tag: 'generateQueries', message: `Took ${after - before} ms to generate ${results.queries.length} queries` })
    return { searchQueries: results.queries }
  }

  const researchCompany = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
    const before = performance.now()
    const maxSearchResults = config.configurable?.maxSearchResults

    const searchTasks: Promise<TavilySearchResponse>[] = []
    for (const query of state.searchQueries) {
      searchTasks.push(
        tavilyClient.search(
          query,
          {
            maxResults: maxSearchResults,
            includeRawContent: true,
            topic: 'general',
          },
        ),
      )
    }
    const searchResults = await Promise.all(searchTasks)
    consola.debug({ tag: 'researchCompany', message: `Took ${performance.now() - before} ms to execute ${searchTasks.length} queries.` })
    const deduplicatedSearchResults = deduplicateSources(searchResults)
    const sourceStr = formatSource(deduplicatedSearchResults)
    const beforeModel = performance.now()
    const prompt = await PromptTemplate.fromTemplate(INFO_PROMPT)
      .format({
        company: state.company,
        info: JSON.stringify(state.extractionSchema, null, 2),
        content: sourceStr,
        user_notes: state.userNotes,
      })
    const outputSchema = z.object({
      notes: z.array(z.string()).describe('List of research notes.'),
    })
    const modelWithOutput = model.withStructuredOutput(outputSchema)
    const result = await modelWithOutput.invoke([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Please provide detailed research notes.' },
    ])
    consola.debug({ tag: 'researchCompany', message: `Took ${performance.now() - beforeModel} ms to generate notes.` })
    const stateUpdate = {
      completedNotes: result.notes,
      ...(config.configurable?.includeSearchResults && {
        searchResult: deduplicatedSearchResults,
      }),
    }
    return stateUpdate
  }

  const gatherNotesExtractSchema = async (
    state: typeof OverallState.State,
  ) => {
    const before = performance.now()
    const notes = formatAllNotes(state.completedNotes)
    const prompt = await PromptTemplate.fromTemplate(EXTRACTION_PROMPT)
      .format({
        info: JSON.stringify(state.extractionSchema, null, 2),
        notes,
      })
    const structuredModel = model.withStructuredOutput(state.extractionSchema)
    const result = await structuredModel.invoke([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Produce a structured output from these notes.' },
    ])
    consola.debug({ tag: 'gatherNotesExtractSchema', message: `Took ${performance.now() - before} ms to extract schema from notes.` })
    return { info: result }
  }

  const reflection = async (
    state: typeof OverallState.State,
  ) => {
    const reflectionSchema = z.object({
      isSatisfactory: z.boolean().describe('True if all required fields are well populated, False otherwise'),
      missingFields: z.array(z.string()).describe('List of field names that are missing or incomplete'),
      searchQueries: z.array(z.string()).describe('If isSatisfactory is False, provide 1-3 targeted search queries to find the missing information'),
      reasoning: z.string().describe('Brief explanation of the assessment'),
    })
    const structuredModel = model.withStructuredOutput(reflectionSchema)
    const prompt = await PromptTemplate.fromTemplate(REFLECTION_PROMPT)
      .format({
        schema: JSON.stringify(state.extractionSchema, null, 2),
        info: JSON.stringify(state.info, null, 2),
      })
    const result = await structuredModel.invoke([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Produce a structured reflection output.' },
    ])
    if (result.isSatisfactory) {
      return { isSatisfactory: result.isSatisfactory }
    }
    else {
      return {
        isSatisfactory: result.isSatisfactory,
        searchQueries: result.searchQueries,
        reflectionStepsTaken: state.reflectionStepsTaken + 1,
      }
    }
  }

  // const builder = new StateGraph({
  //   input: InputState,
  //   output: OutputState,
  //   stateSchema: OverallState,
  // }, ConfigurableAnnotation)

  const builder = new StateGraph({
    input: InputState,
    stateSchema: OverallState,
  }, ConfigurableAnnotation)
    .addNode('generateQueries', generateQueries)
    .addNode('researchCompany', researchCompany)
    .addNode('gatherNotesExtractSchema', gatherNotesExtractSchema)
    .addNode('reflection', reflection)
    .addEdge(START, 'generateQueries')
    .addEdge('generateQueries', 'researchCompany')
    .addEdge('researchCompany', 'gatherNotesExtractSchema')
    .addEdge('gatherNotesExtractSchema', 'reflection')
    .addEdge('gatherNotesExtractSchema', END)

  const graph = builder.compile()

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    consola.debug({ tag: 'eventHandler', message: `Got ${JSON.stringify(body)}` })

    const result = await graph.invoke(
      { company: 'Apple' },
      { configurable: getConfig({ maxSearchQueries: 3 }) },
    )

    return result.info
  })
})
