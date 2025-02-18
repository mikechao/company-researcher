import type { RunnableConfig } from '@langchain/core/runnables'
import type { ConfigurableAnnotation } from '../state/configuration'
import type { OverallState } from '../state/state'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { consola } from 'consola'
import { z } from 'zod'
import { QUERY_WRITER_PROMPT } from '../prompts/prompts'

export default defineLazyEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const model = new ChatAnthropic({
    anthropicApiKey: runtimeConfig.anthropicAPIKey,
    model: 'claude-3-5-sonnet-latest',
  })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'Give a short introduction of yourself to the user'],
    ['human', 'Tell me a joke about {topic}'],
  ])

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
      {"role": "system", "content": queryInstructions},
      {
        "role": "user",
        "content": "Please generate a list of search queries related to the schema that you want to populate.",
      }
    ])
    return {searchQueries: results.queries}
  }

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    consola.debug({ tag: 'eventHandler', message: `Got ${JSON.stringify(body)}` })
    const result = await prompt.pipe(model).invoke({ topic: 'cats' })
    return result.content
  })
})
