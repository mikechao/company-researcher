import { Annotation } from '@langchain/langgraph'

export function getConfig(partial: Partial<typeof ConfigurableAnnotation.State>) {
  return {
    maxSearchQueries: 3,
    maxSearchResults: 3,
    maxReflectionSteps: 0,
    includeSearchResults: false,
    ...partial,
  }
}

export const ConfigurableAnnotation = Annotation.Root({
  /**
   * Max search queries per company
   *
   * default 3
   */
  maxSearchQueries: Annotation<number>({
    reducer: (_state: number, update: number) => update,
    default: () => 3,
  }),
  /**
   * Max search results per query
   *
   * default 3
   */
  maxSearchResults: Annotation<number>({
    reducer: (_state: number, update: number) => update,
    default: () => 3,
  }),
  /**
   * Max reflection steps
   *
   * default 0
   */
  maxReflectionSteps: Annotation<number>({
    reducer: (_state: number, update: number) => update,
    default: () => 0,
  }),
  /**
   * Whether to include search results in the output
   *
   * default false
   */
  includeSearchResults: Annotation<boolean>({
    reducer: (_state: boolean, update: boolean) => update,
    default: () => false,
  }),
})
