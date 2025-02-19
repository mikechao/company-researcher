import { Annotation, StateGraph } from '@langchain/langgraph'

// Example from https://langchain-ai.github.io/langgraphjs/concepts/low_level/#multiple-schemas
// wrapped in a defineLazyEventHandler so it can invoked from postman/browser
// Illustrates that a typescript error occurs when trying to use multiple schemas
// in a single graph
// GitHub Issue
// https://github.com/langchain-ai/langgraphjs/issues/737
export default defineLazyEventHandler(async () => {
  const InputStateAnnotation = Annotation.Root({
    user_input: Annotation<string>,
  })

  const OutputStateAnnotation = Annotation.Root({
    graph_output: Annotation<string>,
  })

  const OverallStateAnnotation = Annotation.Root({
    foo: Annotation<string>,
    bar: Annotation<string>,
    user_input: Annotation<string>,
    graph_output: Annotation<string>,
  })

  const node1 = async (state: typeof InputStateAnnotation.State) => {
    // Write to OverallStateAnnotation
    return { foo: `${state.user_input} name` }
  }

  const node2 = async (state: typeof OverallStateAnnotation.State) => {
    // Read from OverallStateAnnotation, write to OverallStateAnnotation
    return { bar: `${state.foo} is` }
  }

  const node3 = async (state: typeof OverallStateAnnotation.State) => {
    // Read from OverallStateAnnotation, write to OutputStateAnnotation
    return { graph_output: `${state.bar} Lance` }
  }

  const graph = new StateGraph({
    input: InputStateAnnotation,
    output: OutputStateAnnotation,
    stateSchema: OverallStateAnnotation,
  })
    .addNode('node1', node1)
    .addNode('node2', node2)
    .addNode('node3', node3)
    .addEdge('__start__', 'node1')
    .addEdge('node1', 'node2')
    .addEdge('node2', 'node3')
    .compile()
  return defineEventHandler(async (_webEvent) => {
    const graphResult = await graph.invoke({ user_input: 'My' })
    return graphResult
  })
})
