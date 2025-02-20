import process from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    dev: process.env.NODE_ENV !== 'production',
    anthropicAPIKey: process.env.NUXT_ANTHROPIC_API_KEY,
    tavilyAPIKey: process.env.NUXT_TAVILY_API_KEY,
  },

  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  tailwindcss: {
    config: {
      theme: {
        extend: {},
      },
      content: {
        files: [
          'srcDir/components/**/*.{vue,js,jsx,mjs,ts,tsx}',
          'srcDir/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}',
          'srcDir/pages/**/*.{vue,js,jsx,mjs,ts,tsx}',
          'srcDir/plugins/**/*.{js,ts,mjs}',
          'srcDir/composables/**/*.{js,ts,mjs}',
          'srcDir/utils/**/*.{js,ts,mjs}',
          'srcDir/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}',
          'srcDir/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}',
          'srcDir/app.config.{js,ts,mjs}',
          'srcDir/app/spa-loading-template.html',
        ],
      },
      plugins: []
    },
  },
})