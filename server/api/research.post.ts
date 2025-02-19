import type { RunnableConfig } from '@langchain/core/runnables'
import type { Annotation, StateType } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { END, START, StateGraph } from '@langchain/langgraph'
import { consola } from 'consola'
import { z } from 'zod'
import { QUERY_WRITER_PROMPT } from '../prompts/prompts'
import { ConfigurableAnnotation, getConfig } from '../state/configuration'
import { InputState, OutputState, OverallState } from '../state/state'

export default defineLazyEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const model = new ChatAnthropic({
    anthropicApiKey: runtimeConfig.anthropicAPIKey,
    model: 'claude-3-5-sonnet-latest',
  })

  const generateQueries = async (
    state: typeof OverallState.State,
    config: RunnableConfig<typeof ConfigurableAnnotation.State>,
  ) => {
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

    return { searchQueries: results.queries }
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
    .addEdge(START, 'generateQueries')
    .addEdge('generateQueries', END)

  const graph = builder.compile()

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    consola.debug({ tag: 'eventHandler', message: `Got ${JSON.stringify(body)}` })

    const result = await graph.invoke(
      { company: 'Apple' },
      { configurable: getConfig({ maxSearchQueries: 4 }) },
    )

    return result.searchQueries
  })
})
