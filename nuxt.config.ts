import process from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    anthropicAPIKey: process.env.NUXT_ANTHROPIC_API_KEY,
    tavilyAPIKey: process.env.NUXT_TAVILY_API_KEY,
  },
})
