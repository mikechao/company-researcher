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
