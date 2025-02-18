export default defineLazyEventHandler(async () => {
  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)

    return 'Hello from research.post!'
  })
})
