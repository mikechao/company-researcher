<h1 align="center">
  <img src="https://github.com/mikechao/company-researcher/blob/main/public/favicon.svg" width=32 height=32/>
  Company Researcher Agent
</h1>

<p align="left">
  An AI Agent that will search the web for information based on a company name and report schema provided by the user.
</p>

<p align="left">
  This is partially a port of the Python project from <a href="https://github.com/langchain-ai/company-researcher?tab=readme-ov-file" >LangChain AI</a>
</p>

<p align="center">
Currently live at <a href="https://company-researcher-orpin.vercel.app/">https://company-researcher-orpin.vercel.app/</a>
</p>

## How it works

The Company Researcher Agent leverages LangGraph in the backend to execute the research task while using NuxtJS on the frontend to convey results and progress to the user.

The graph constructed with LangGraph

![Langgraph-graph](https://github.com/mikechao/company-researcher/blob/main/public/graph.webp)

1. We start with the generateQueries node, where we ask the AI to generate search queries that are related to the company name and report schema provided by the user.
2. We than move on to the researchCompany node, where the search queries are executed with the Tavily API. Then we ask the LLM to take notes from the search results that are relevant to the report schema from the search results.
3. The gatherNotesExtractSchema is the next step where we ask the LLM to fill in the report schema provided by the user using notes taken in the previous step.
4. In the reflection step we ask the LLM to look over the filled in report schema and evaluate if it is satisfactory. This is determined by Are any required fields missing?, Are any fields incomplete or containing uncertain information? and Are there fields with placeholder values or "unknown" marker? If the reflection is satisfactory a reason will be provided and the results shown to the user. If the reflection is not satisfactory 1 to 3 search queries are provided to fill in missing fields and we go back to the researchCompany node to start the process again.

## Making it work in a serverless environment

When deploying to [Vercel](https://vercel.com/) we need to take into account the time limit that is placed on the execution of HTTP endpoint calls. Vercel puts in these limits to prevent run away consumption of resources. There is a good chance that executing the LangGraph graph as construed above would run into these limits. (Default 10 seconds, configurable up to 60s)

Because of these limits on execution I introduced a new node in the graph where I used interrupt to wait for feedback from the "user". [LangGraph Interrupt](https://langchain-ai.github.io/langgraphjs/how-tos/wait-user-input/#simple-usage) The "user" in this case is just the frontend where I programmatically send a message to continue execution of the graph. Each node in the previous graph is now route to the waitForResponse node where interrupt is used.

The resulting graph

![Lang Graph Step](https://github.com/mikechao/company-researcher/blob/main/public/step-graph.png)

## Sending progress and intermediate results

I used a combination of LangChain/LangGraph's stream events api and custom events to display progress to the user. [LangGraph Stream Events](https://langchain-ai.github.io/langgraphjs/how-tos/streaming-events-from-within-tools/#stream-events-from-the-graph) When a custom event is surfaced as part of the ReadableStream returned from the backend I used [Vercel AI SDK stream protocol](https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol) to send the data to be processed/handled by the front end.

## 🛠️ Installation Steps

1. Get an Anthropic API Key
2. Get a Tavily API Key
3. Get a Postgres URL
4. Create a .env by following [env example](./.env-example)
5. Install project dependencies

```bash
pnpm install
```

6. Start the development server on `http://localhost:3000`

```bash
pnpm dev
```

## 👷 Built with

| Name         |                                         Link                                         | Usage                                                     |
| :----------- | :----------------------------------------------------------------------------------: | :-------------------------------------------------------- |
| NuxtJS       |       [![My Skills](https://skillicons.dev/icons?i=nuxtjs)](https://nuxt.com/)       | Building pages, interactions and server apis              |
| TypeScript   |  [![My Skills](https://skillicons.dev/icons?i=ts)](https://www.typescriptlang.org/)  | Static typing, better autocompletion                      |
| Pinia        |    [![My Skills](https://skillicons.dev/icons?i=pinia)](https://pinia.vuejs.org/)    | Management of intermediate research results |
|Langchain|<a href="https://js.langchain.com/docs/introduction/"><img src="https://js.langchain.com/img/brand/favicon.png" width="50"></a> | Integration with LLM managing memory and prompts |
|LangGraph|<a href="https://langchain-ai.github.io/langgraphjs/"><img src="https://langchain-ai.github.io/langgraphjs/static/favicon.png" width="50"></a>|Orchestrating the research workflow|
| Pnpm         |        [![My Skills](https://skillicons.dev/icons?i=pnpm)](https://pnpm.io/)         | Manage JavaScript packages                                |
| Postgres     | [![My Skills](https://skillicons.dev/icons?i=postgres)](https://www.postgresql.org/) | Persistence of chat messages                              |
| Tailwind Css |  [![My Skills](https://skillicons.dev/icons?i=tailwind)](https://tailwindcss.com/)   | CSS Styling                                               |
| Vite         |        [![My Skills](https://skillicons.dev/icons?i=vite)](https://vite.dev)         | Build tool                                             |
|Visual Studio Code|[![My Skills](https://skillicons.dev/icons?i=vscode)](https://code.visualstudio.com/)| Code Editor |
|Vercel|[![My Skills](https://skillicons.dev/icons?i=vercel)](https://vercel.com/)| App hosting and useChat composable |
|Zod|<a href="https://zod.dev/"><img src="https://zod.dev/static/favicon.ico" width="50"></a>|Defining structured output for LLMs, form validation, REST Endpoint input validation|

## 🚧 Issues

- In the Python version from LangChain they are able to specify an Input, Overall and Output State for the graph. However in the JavaScript/TypeScript version of LangGraph this causes a type mismatch error. The same type mismatch error is exist in their [multi-schema example](https://langchain-ai.github.io/langgraphjs/concepts/low_level/#multiple-schemas) The type mismatch error is also shown in [multi.post.ts](./server/api/multi.post.ts) The following [Github issue](https://github.com/langchain-ai/langgraphjs/issues/737) is tracking this, but there doesn't seem to be much activity.