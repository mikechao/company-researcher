import process from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    dev: process.env.NODE_ENV !== 'production',
    anthropicAPIKey: process.env.NUXT_ANTHROPIC_API_KEY,
    tavilyAPIKey: process.env.NUXT_TAVILY_API_KEY,
    public: {
      endPoint: process.env.END_POINT ? process.env.END_POINT : '/api/research',
    },
  },
  css: ['~/assets/css/app.css'],
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-codemirror',
    '@morev/vue-transitions/nuxt',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
    storageKey: 'company-researcher',
  },
})
