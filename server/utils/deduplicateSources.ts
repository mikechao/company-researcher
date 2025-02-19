import type { TavilySearchResponse } from '@tavily/core'

export function deduplicateSources(searchResponses: TavilySearchResponse[]) {
  const sourceList = []
  for (const response of searchResponses) {
    if (response.results && response.results.length > 0) {
      sourceList.push(...response.results)
    }
  }
  const uniqueURLS = new Set()
  const uniqueSources = []
  for (const source of sourceList) {
    if (!uniqueURLS.has(source.url)) {
      uniqueURLS.add(source.url)
      uniqueSources.push(source)
    }
  }
  return uniqueSources
}
