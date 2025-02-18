import { consola } from 'consola'

export default defineLazyEventHandler(async () => {
  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    consola.debug({ tag: 'eventHandler', message: `Got ${JSON.stringify(body)}` })
    return 'Hello from research.post!'
  })
})
