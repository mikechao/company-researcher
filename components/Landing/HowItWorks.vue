<script setup lang="ts">
const features = [
  {
    icon: 'i-mdi-numeric-1-circle-outline',
    title: 'Generate Queries',
    description:
      'The agent generates search queries based on the company name and report schema provided.',
    link: '#',
  },
  {
    icon: 'i-mdi-numeric-2-circle-outline',
    title: 'Research Company',
    description:
      'The agent executes the generated queries. Then the agent generates notes based on the search results and report schema.',
    link: '#',
  },
  {
    icon: 'i-mdi-numeric-3-circle-outline',
    title: 'Gather Notes and Extract Schema',
    description:
      'The agent gathers the notes and fills out the report schema from the notes.',
    link: '#',
  },
  {
    icon: 'i-mdi-numeric-4-circle-outline',
    title: 'Reflection',
    description:
      'The agent evaluates the quality of the report schema for the following:\nAnalyzes completeness of required fields\nIdentifies any missing or incomplete information\nGenerates targeted follow-up search queries if needed\nContinues research until information is satisfactory or max reflection steps reached',
    link: '#',
  },
]
</script>

<template>
  <div id="how-it-works" class="flex flex-col items-center justify-start gap-x-24 lg:flex-row">
    <div class="flex w-full flex-col gap-y-24 lg:w-1/2">
      <div class="flex flex-col gap-y-2">
        <span
          class="text-dark-950 dark:text-dark-50 inline-block text-3xl font-bold"
        >How it works</span>
        <p class="text-dark-950/50 dark:text-dark-50/50 text-lg font-normal">
          The Company Researcher Agent utilizes a graph created with
          <a
            href="https://langchain-ai.github.io/langgraph/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            LangGraph
            <UIcon name="i-mdi-launch" class="inline-block align-middle" />
          </a>
          to scan the web for details about a company provided by the user.
        </p>
      </div>
      <div class="grid w-full grid-cols-4 gap-24">
        <template v-for="(feat, index) in features" :key="index">
          <div class="col-span-full flex flex-col gap-y-2 md:col-span-2">
            <div
              class="border-dark-950/20 bg-dark-200/20 dark:border-dark-700 dark:bg-dark-800 flex size-8 items-center justify-center rounded-md border p-1"
            >
              <UIcon
                :name="feat.icon"
                class="text-dark-950 dark:text-dark-50"
              />
            </div>
            <span
              class="text-dark-950 dark:text-dark-50 inline-block text-lg font-bold"
            >{{ feat.title }}</span>
            <p
              class="text-dark-950/50 dark:text-dark-50 inline-block text-base font-normal whitespace-pre-line"
            >
              {{ feat.description }}
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="relative mt-24 h-full w-full lg:mt-0 lg:w-1/2 xl:h-[620px]">
      <img
        src="/graph.png"
        class="max-h-full max-w-full rounded-sm object-contain"
        loading="lazy"
        alt="langgraph-graph"
        width="640"
        height="640"
      >
    </div>
  </div>
</template>
