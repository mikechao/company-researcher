<script setup lang="ts">
import ClickableIcon from '../ClickableIcon.vue'

const icons = [
  {
    icon: 'i-logos-nuxt-icon',
    href: 'https://nuxtjs.org/',
    label: 'link to Nuxt.js website',
  },
  {
    icon: 'i-logos-tailwindcss-icon',
    href: 'https://tailwindcss.com/',
    label: 'link to Tailwind CSS website',
  },
  {
    icon: 'i-simple-icons-langgraph',
    href: 'https://langchain-ai.github.io/langgraph/',
    label: 'link to LangGraph website',
  },
  {
    icon: 'i-logos-typescript-icon',
    href: 'https://www.typescriptlang.org/',
    label: 'link to TypeScript website',
  },
  {
    icon: 'i-logos-vitejs',
    href: 'https://vitejs.dev/',
    label: 'link to Vite website',
  },
  {
    icon: 'i-logos-vercel-icon',
    href: 'https://vercel.com/',
    label: 'link to Vercel website',
  },
  {
    icon: 'i-logos-postgresql',
    href: 'https://www.postgresql.org/',
    label: 'link to PostgreSQL website',
  },
  {
    icon: 'i-logos-pnpm',
    href: 'https://pnpm.io/',
    label: 'link to pnpm website',
  },
  {
    icon: 'i-logos-github-icon',
    href: 'https://github.com/',
    label: 'link to GitHub website',
  },
  {
    icon: 'i-logos-zod',
    href: 'https://zod.dev/',
    label: 'link to Zod website',
  },
]
</script>

<template>
  <div
    class="relative flex h-full min-h-dvh w-full flex-col items-center justify-center bg-dark-50 dark:bg-dark-950 py-24"
  >
    <div class="relative z-20 mb-16 w-11/12 md:w-10/12">
      <div class="flex flex-col items-center justify-center">
        <h2
          class="mt-4 text-center text-5xl font-normal text-dark-800 sm:text-6xl md:text-7xl dark:text-dark-100"
        >
          Built With
        </h2>
        <p
          class="text-gray-700 dark:text-gray-200 mt-4 w-full text-center text-lg font-light leading-8 sm:w-1/2 2xl:w-1/3 2xl:text-xl"
        >
          This application utilizes the following technologies.
        </p>
      </div>
    </div>

    <div class="relative z-20 w-full py-2">
      <NuxtMarquee :pause-on-hover="true" :speed="25" :auto-fill="true">
        <template v-for="(icon, index) in icons" :key="index">
          <ClickableIcon :icon="icon.icon" :href="icon.href" :label="icon.label" />
        </template>
      </NuxtMarquee>
    </div>
  </div>
</template>
