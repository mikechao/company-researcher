<script setup lang="ts">
import LandingHero from '~/components/Landing/Hero.vue'

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
</template>
