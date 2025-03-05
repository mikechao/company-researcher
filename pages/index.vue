<script setup lang="ts">
useSeoMeta({
  title: 'Company Researcher',
  ogTitle: 'Company Researcher',
  description: 'Company Researcher is an AI agent to help you find information about companies.',
  ogDescription: 'Company Researcher is an AI agent to help you find information about companies.',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <LandingHero />
  <LandingHowItWorks />
  <LandingBuiltWith />
</template>
