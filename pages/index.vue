<template>
  <ULandingHero
    title="Company Researcher"
    description="An AI agent that scans the web for details about a company provided by the user"
  >
    <template #links>
      <UButton
        label="Research"
        icon="i-mdi-microscope"
        to="/research"
        :trailing="true"
        color="primary"
      />
      <UButton
        label="How it works"
        icon="i-mdi-arrow-down"
        variant="outline"
        :trailing="true"
        color="primary"
        to="#how-it-works"
      />
    </template>
  </ULandingHero>
  <div id="how-it-works">
    <ULandingSection
      icon="i-mdi-head-cog-outline"
      data-aos="fade-up"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="1500"
      title="How it works"
      align="left"
      :ui="{
        features: {
          description: 'whitespace-pre-line',
        },
      }"
      :features="[
        {
          name: 'Generate Queries',
          description: 'The agent generates search queries based on the company name and report schema provided.',
          icon: 'i-mdi-numeric-1-circle-outline',
        },
        {
          name: 'Research Company',
          description: 'The agent executes the generated queries. Then the agent generates notes based on the search results and report schema.',
          icon: 'i-mdi-numeric-2-circle-outline',
        },
        {
          name: 'Gather Notes and Extract Schema',
          description: 'The agent gathers the notes and fills out the report schema from the notes.',
          icon: 'i-mdi-numeric-3-circle-outline',
        },
        {
          name: 'Reflection',
          description: 'The agent evaluates the quality of the report schema for the following:\nAnalyzes completeness of required fields\nIdentifies any missing or incomplete information\nGenerates targeted follow-up search queries if needed\nContinues research until information is satisfactory or max reflection steps reached',
          icon: 'i-mdi-numeric-4-circle-outline',
        },
      ]"
    >
      <template #description>
        <span>
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
        </span>
      </template>
      <img
        src="/graph.png"
        class="w-fit rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700 mx-auto"
      >
    </ULandingSection>
  </div>
</template>
