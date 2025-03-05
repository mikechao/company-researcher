<script setup lang="ts">
import ClickableIcon from '../ClickableIcon.vue'

const icons = [
  {
    icon: 'i-simple-icons-nuxt',
    href: 'https://nuxtjs.org/',
  },
  {
    icon: 'i-simple-icons-tailwindcss',
    href: 'https://tailwindcss.com/',
  },
  {
    icon: 'i-simple-icons-langgraph',
    href: 'https://langchain-ai.github.io/langgraph/',
  },
  {
    icon: 'i-simple-icons-typescript',
    href: 'https://www.typescriptlang.org/',
  },
  {
    icon: 'i-simple-icons-vite',
    href: 'https://vitejs.dev/',
  },
  {
    icon: 'i-simple-icons-vercel',
    href: 'https://vercel.com/',
  },
  {
    icon: 'i-simple-icons-postgresql',
    href: 'https://www.postgresql.org/',
  },
  {
    icon: 'i-simple-icons-github',
    href: 'https://github.com/',
  },
  {
    icon: 'i-simple-icons-zod',
    href: 'https://zod.dev/',
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
      <NuxtMarquee :pause-on-hover="true" :speed="25">
        <div class="flex w-full items-center justify-center gap-12">
          <template v-for="(icon, index) in icons" :key="index">
            <ClickableIcon :icon="icon.icon" :href="icon.href" />
          </template>
        </div>
      </NuxtMarquee>
    </div>
  </div>
</template>
