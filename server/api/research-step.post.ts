import type { RunnableConfig } from '@langchain/core/runnables'
import type { TavilySearchResponse } from '@tavily/core'
import { ChatAnthropic } from '@langchain/anthropic'
import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch'
import { PromptTemplate } from '@langchain/core/prompts'
import { Command, END, interrupt, START, StateGraph } from '@langchain/langgraph'
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres'
import { tavily } from '@tavily/core'
import { formatDataStreamPart } from 'ai'
import { consola } from 'consola'
import { LocalFileCache } from 'langchain/cache/file_system'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { timestamp } from '~/composables/timestampString'
import { defaultExtractionSchema, EVENT_NAMES } from '~/types/constants'
import { EXTRACTION_PROMPT, INFO_PROMPT, QUERY_WRITER_PROMPT, REFLECTION_PROMPT } from '../prompts/prompts'
import { ConfigurableAnnotation, getConfig } from '../state/configuration'
import { InputState, OverallState, WaitForResponseState } from '../state/state'
import { deduplicateSources } from '../utils/deduplicateSources'
import { formatAllNotes } from '../utils/formatNotes'
import { formatSource } from '../utils/formatSources'

export default defineLazyEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const checkpointer = PostgresSaver.fromConnString(
    runtimeConfig.postgresURL,
  )
  await checkpointer.setup()

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
    dispatchCustomEvent(EVENT_NAMES.GENERATED_QUERIES, { queries: results.queries })
    return {
      searchQueries: results.queries,
      nextNodeName: 'executeSearchQueries',
    }
  }

  const waitForResponse = async (
    state: typeof WaitForResponseState.State,
  ) => {
    const interruptValue = interrupt('waiting for response from client')
    consola.debug({ tag: 'waitForResponse', message: `Resuming with ${interruptValue}. Next node name ${state.nextNodeName}` })
    return new Command({
      goto: state.nextNodeName,
    })
  }

  const executeSearchQueries = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
    const before = performance.now()
    const searchTasks: Promise<TavilySearchResponse>[] = []
    for (const query of state.searchQueries) {
      searchTasks.push(
        tavilyClient.search(
          query,
          {
            maxResults: 3,
            includeRawContent: true,
            topic: 'general',
          },
        ),
      )
    }
    const searchResults = await Promise.all(searchTasks)
    dispatchCustomEvent(EVENT_NAMES.EXECUTED_QUERIES, { time: `${performance.now()}` })
    const deduplicatedSearchResults = deduplicateSources(searchResults)
    const sourceStr = formatSource(deduplicatedSearchResults)
    const after = performance.now()
    consola.debug({ tag: 'executeSearchQueries', message: `Took ${after - before} ms to execute ${searchTasks.length} queries.` })
    const stateUpdate = {
      ...(config.configurable?.includeSearchResults && {
        searchResult: deduplicatedSearchResults,
      }),
      sourceStr,
      nextNodeName: 'researchCompany',
    }
    return stateUpdate
  }

  const researchCompany = async (
    state: typeof OverallState.State,
  ) => {
    const beforeModel = performance.now()
    const outputSchema = z.object({
      notes: z.array(z.string()).describe('List of research notes.'),
    })
    const prompt = await PromptTemplate.fromTemplate(INFO_PROMPT)
      .format({
        company: state.company,
        info: JSON.stringify(state.extractionSchema, null, 2),
        content: state.sourceStr,
        user_notes: state.userNotes,
        output_schema: JSON.stringify(zodToJsonSchema(outputSchema), null, 2),
      })

    const modelWithOutput = model.withStructuredOutput(outputSchema)
    const result = await modelWithOutput.invoke([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Please provide detailed research notes.' },
    ])
    consola.debug({ tag: 'researchCompany', message: `Took ${performance.now() - beforeModel} ms to generate notes.` })
    dispatchCustomEvent(EVENT_NAMES.GENERATED_NOTES, { notes: result.notes })
    const stateUpdate = {
      completedNotes: result.notes,
      nextNodeName: 'gatherNotesExtractSchema',
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
    dispatchCustomEvent(EVENT_NAMES.NOTES_TO_SCHEMA, { time: performance.now() })
    return {
      info: result,
      nextNodeName: 'reflection',
    }
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
      const resultValue = {
        isSatisfactory: result.isSatisfactory,
      }
      dispatchCustomEvent(EVENT_NAMES.REFLECTION, resultValue)
      return resultValue
    }
    else {
      const returnValue = {
        isSatisfactory: result.isSatisfactory,
        searchQueries: result.searchQueries,
        reflectionStepsTaken: state.reflectionStepsTaken + 1,
      }
      dispatchCustomEvent(EVENT_NAMES.REFLECTION, returnValue)
      return returnValue
    }
  }

  const routeFromReflection = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
    if (state.isSatisfactory) {
      consola.debug({ tag: 'routeFromReflection', message: 'reflection is satisfactory, going to END' })
      const endData = {
        info: state.info,
        ...(config.configurable?.includeSearchResults && {
          searchResults: state.searchResult,
        }),
      }
      dispatchCustomEvent(EVENT_NAMES.END, endData)
      return END
    }
    const maxReflectionSteps = (config.configurable?.maxReflectionSteps ?? 0)
    if (state.reflectionStepsTaken <= maxReflectionSteps) {
      consola.debug({ tag: 'routeFromReflection', message: `reflection is not satisfactory and reflection steps taken ${state.reflectionStepsTaken} 
        is less than or equal to configured max reflection steps of ${maxReflectionSteps}, going to researchCompany` })
      dispatchCustomEvent(EVENT_NAMES.REROUTE, { reroute: 'researchCompany' })
      return 'researchCompany'
    }
    const endData = {
      info: state.info,
      ...(config.configurable?.includeSearchResults && {
        searchResults: state.searchResult,
      }),
    }
    dispatchCustomEvent(EVENT_NAMES.END, endData)
    return END
  }

  const builder = new StateGraph({
    input: InputState,
    stateSchema: OverallState,
  }, ConfigurableAnnotation)
    .addNode('generateQueries', generateQueries)
    .addNode('researchCompany', researchCompany)
    .addNode('gatherNotesExtractSchema', gatherNotesExtractSchema)
    .addNode('reflection', reflection)
    .addNode('executeSearchQueries', executeSearchQueries)
    .addNode('waitForResponse', waitForResponse, {
      input: WaitForResponseState,
      ends: ['generateQueries', 'researchCompany', 'gatherNotesExtractSchema', 'reflection', 'executeSearchQueries'],
    })
    .addEdge(START, 'generateQueries')
    .addEdge('generateQueries', 'waitForResponse')
    .addEdge('executeSearchQueries', 'waitForResponse')
    .addEdge('researchCompany', 'waitForResponse')
    .addEdge('gatherNotesExtractSchema', 'waitForResponse')
    .addConditionalEdges('reflection', routeFromReflection)

  const graph = builder.compile({ checkpointer })

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

  return defineEventHandler(async (event) => {
    const body = await readBody(event)

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
    const { message } = body
    consola.debug({ tag: 'research-step', message: `Received message: ${message.content}` })
    const { sessionId, company, userNotes, extractionSchema, maxSearchQueries, maxSearchResults, maxReflectionSteps, includeSearchResults } = validatedBody
    const config = { version: 'v2' as const, configurable: { thread_id: sessionId, ...getConfig({ maxSearchQueries, maxSearchResults, maxReflectionSteps, includeSearchResults }) } }
    const initialInput = { company, userNotes, extractionSchema }
    const isInit = message.content === 'init'
    const input = isInit ? initialInput : new Command({ resume: message.content })
    const encoder = new TextEncoder()
    return new ReadableStream({
      async start(controller) {
        try {
          const graphEvents = graph.streamEvents(input, config)
          for await (const event of graphEvents) {
            if (event.event === 'on_custom_event') {
              const data: ResearchEvent = {
                event: event.name,
                data: event.data,
                timestamp: timestamp(),
              }
              const id = uuidv4()
              // format according data part of https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol
              const part = `2:[{"id":"${id}","name":"${event.name}","data":${JSON.stringify(data)}}]\n`
              controller.enqueue(part)

              const text = formatDataStreamPart('text', event.name)
              controller.enqueue(encoder.encode(text))
            }
          }
        }
        catch (error) {
          console.error('Error in graph events', error)
        }
        finally {
          controller.close()
        }
      },
    })
  })
})
