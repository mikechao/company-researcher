import { Annotation } from '@langchain/langgraph'

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
