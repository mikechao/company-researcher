import type { RunnableConfig } from '@langchain/core/runnables'
import type { TavilySearchResponse } from '@tavily/core'
import { ChatAnthropic } from '@langchain/anthropic'
import { PromptTemplate } from '@langchain/core/prompts'
import { END, START, StateGraph } from '@langchain/langgraph'
import { tavily } from '@tavily/core'
import { consola } from 'consola'
import { LocalFileCache } from 'langchain/cache/file_system'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { defaultExtractionSchema } from '~/types/constants'
import { EXTRACTION_PROMPT, INFO_PROMPT, QUERY_WRITER_PROMPT, REFLECTION_PROMPT } from '../prompts/prompts'
import { ConfigurableAnnotation, getConfig } from '../state/configuration'
import { InputState, OverallState } from '../state/state'
import { deduplicateSources } from '../utils/deduplicateSources'
import { formatAllNotes } from '../utils/formatNotes'
import { formatSource } from '../utils/formatSources'

export default defineLazyEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const cache = runtimeConfig.dev
    ? await LocalFileCache.create('langchain-cache-travel')
    : undefined
  const model = new ChatAnthropic({
    anthropicApiKey: runtimeConfig.anthropicAPIKey,
    model: 'claude-3-5-sonnet-latest',
    cache,
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
    const outputSchema = z.object({
      notes: z.array(z.string()).describe('List of research notes.'),
    })
    const prompt = await PromptTemplate.fromTemplate(INFO_PROMPT)
      .format({
        company: state.company,
        info: JSON.stringify(state.extractionSchema, null, 2),
        content: sourceStr,
        user_notes: state.userNotes,
        output_schema: JSON.stringify(zodToJsonSchema(outputSchema), null, 2),
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
    const before = performance.now()
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
    consola.debug({ tag: 'reflection', message: `Took ${performance.now() - before} ms to reflect on the extracted information.` })
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

  const routeFromReflection = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
    if (state.isSatisfactory) {
      consola.debug({ tag: 'routeFromReflection', message: 'reflection is satisfactory, going to END' })
      return END
    }
    const maxReflectionSteps = (config.configurable?.maxReflectionSteps ?? 0)
    if (state.reflectionStepsTaken <= maxReflectionSteps) {
      consola.debug({ tag: 'routeFromReflection', message: `reflection is not satisfactory and reflection steps taken ${state.reflectionStepsTaken} 
        is less than or equal to configured max reflection steps of ${maxReflectionSteps}, going to researchCompany` })
      return 'researchCompany'
    }
    return END
  }

  // including OutputState in the graph causes a typescript error
  // see multi.post.ts for a similar issue
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
    .addConditionalEdges('reflection', routeFromReflection)

  const graph = builder.compile()

  const inputSchema = z.object({
    sessionId: z.string().min(1, { message: 'Session ID is required' }),
    company: z.string().min(1, { message: 'Company name is required' }),
    maxSearchQueries: z.number().optional().default(3),
    maxSearchResults: z.number().optional().default(3),
    maxReflectionSteps: z.number().optional().default(0),
    includeSearchResults: z.boolean().optional().default(false),
    userNotes: z.string().optional().default(''),
    extractionSchema: z.record(z.any()).optional().default(() => defaultExtractionSchema),
  })

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    const parsedBody = inputSchema.safeParse(body)
    if (!parsedBody.success) {
      const formattedError = parsedBody.error.flatten()
      consola.error({ tag: 'eventHandler', message: `Invalid input: ${JSON.stringify(formattedError)}` })
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: JSON.stringify(formattedError) || 'Invalid input',
      })
    }
    const validatedBody = parsedBody.data
    consola.debug({ tag: 'eventHandler', message: `Received input: ${JSON.stringify(validatedBody)}` })
    const { sessionId, company, userNotes, extractionSchema, maxSearchQueries, maxSearchResults, maxReflectionSteps, includeSearchResults } = validatedBody
    const config = { version: 'v2' as const, configurable: { thread_id: sessionId, ...getConfig({ maxSearchQueries, maxSearchResults, maxReflectionSteps, includeSearchResults }) } }
    const input = { company, userNotes, extractionSchema }

    const graphResults = await graph.invoke(input, config)
    const output = {
      ...(includeSearchResults && { searchResult: graphResults.searchResult }),
      info: graphResults.info,
    }
    return output
  })
})
