/**
 * Not export in @tavily/core
 */
interface TavilySearchResult {
  title: string
  url: string
  content: string
  rawContent?: string
  score: number
  publishedDate: string
}

export function formatSource(sourceList: TavilySearchResult[], includeRawContent: boolean = true, maxTokensPerSource: number = 1000) {
  let formattedText = 'Sources:\n\n'
  for (const source of sourceList) {
    formattedText += `Source ${source.title}:\n===\n`
    formattedText += `URL: ${source.url}\n===\n`
    formattedText += `Most relevant content from source: ${source.content}\n===\n`
    if (includeRawContent) {
      // Using rough estimate of 4 characters per token
      const charLimit = maxTokensPerSource * 4
      let rawContent = source.rawContent || ''
      if (rawContent.length > charLimit) {
        rawContent = `${rawContent.slice(0, charLimit)}...[truncated]`
      }
      formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${rawContent}\n\n`
    }
  }

  return formattedText.trim()
}
