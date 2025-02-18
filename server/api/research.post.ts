import { ChatAnthropic } from '@langchain/anthropic'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { consola } from 'consola'

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

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    consola.debug({ tag: 'eventHandler', message: `Got ${JSON.stringify(body)}` })
    const result = await prompt.pipe(model).invoke({ topic: 'cats' })
    return result.content
  })
})
