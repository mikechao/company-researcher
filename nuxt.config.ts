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
    '@pinia/nuxt',
    'nuxt-marquee',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
    storageKey: 'company-researcher',
  },
  icon: {
    clientBundle: {
      icons: [
        'mdi:weather-sunny',
        'mdi:weather-night',
        'mdi:github',
        'mdi:palette-outline',
        'mdi:arrow-down',
        'mdi:launch',
        'mdi:menu',
        'mdi:microscope',
        'mdi:numeric-1-circle-outline',
        'mdi:numeric-2-circle-outline',
        'mdi:numeric-3-circle-outline',
        'mdi:numeric-4-circle-outline',
        'logos:nuxt-icon',
        'logos:tailwindcss-icon',
        'logos:typescript-icon',
        'simple-icons:langgraph',
        'logos:vitejs',
        'logos:vercel-icon',
        'logos:postgresql',
        'logos:pnpm',
        'logos:github-icon',
        'logos:zod',
      ],
      sizeLimitKb: 256,
    },
  },
})
