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
        icon="i-mdi-numeric-1-circle-outline"
      />
      <ULandingCard
        title="Phase 2: Search the Web"
        description="The agent searches the web for relevant information using the generated search queries"
        icon="i-mdi-numeric-2-circle-outline"
      />
      <ULandingCard
        title="Phase 3: Extract Notes"
        description="The agent extracts notes from the search results that match the JSON schema provided by the user"
        icon="i-mdi-numeric-3-circle-outline"
      />
      <ULandingCard
        title="Phase 4: Generate Report"
        description="The agent generates a report containing the extracted notes and the search results"
        icon="i-mdi-numeric-4-circle-outline"
      />
      <ULandingCard
        title="Phase 5: Reflection"
        description="The agent reviews on how well the generated report is filled out. If the agent is not satisfied, it will generate additional search queries and return to Phase 2"
        icon="i-mdi-numeric-5-circle-outline"
      />
    </UPageGrid>
  </ULandingSection>
</template>
