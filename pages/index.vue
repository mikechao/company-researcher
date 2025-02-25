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
  <ULandingSection
    id="how-it-works"
    icon="i-mdi-head-cog-outline"
    title="How it works"
    description="The Company Researcher Agent utilizes a multi-phase workflow that decouples web research from schema extraction, resulting in more efficient resource allocation and thorough data collection"
    align="center"
  >
    <UPageGrid>
      <ULandingCard
        title="Phase 1: Generate Search Queries"
        description="The agent generates search queries based on the company name and the JSON schema provided by the user"
      />
      <ULandingCard
        title="Phase 2: Search the Web"
        description="The agent searches the web for relevant information using the generated search queries"
      />
    </UPageGrid>
  </ULandingSection>
</template>
