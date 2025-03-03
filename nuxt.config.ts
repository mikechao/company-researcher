import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    dev: process.env.NODE_ENV !== 'production',
    anthropicAPIKey: process.env.NUXT_ANTHROPIC_API_KEY,
    tavilyAPIKey: process.env.NUXT_TAVILY_API_KEY,
    postgresURL: process.env.NUXT_POSTGRES_URL,
    public: {
      endPoint: process.env.END_POINT ? process.env.END_POINT : '/api/research-step',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-codemirror',
    '@vueuse/motion/nuxt',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
    storageKey: 'company-researcher',
  },
})
