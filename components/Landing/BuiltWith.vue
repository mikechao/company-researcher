<script setup lang="ts">
const icons = [
  'i-simple-icons-adobeillustrator',
  'i-simple-icons-amazon',
  'i-simple-icons-akaunting',
  'i-simple-icons-alchemy',
  'i-simple-icons-amp',
  'i-simple-icons-google',
  'i-simple-icons-facebook',
  'i-simple-icons-vite',
  'i-simple-icons-nike',
  'i-simple-icons-apple',
  'i-simple-icons-microsoft',
  'i-simple-icons-twitter',
  'i-simple-icons-linkedin',
  'i-simple-icons-instagram',
  'i-simple-icons-youtube',
  'i-simple-icons-whatsapp',
  'i-simple-icons-telegram',
  'i-simple-icons-tiktok',
  'i-simple-icons-snapchat',
  'i-simple-icons-pinterest',
  'i-simple-icons-twitch',
  'i-simple-icons-discord',
  'i-simple-icons-reddit',
  'i-simple-icons-medium',
  'i-simple-icons-spotify',
  'i-simple-icons-netflix',
  'i-simple-icons-hulu',
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

    <!-- Fixed tech grid - simplified and more explicit -->
    <div class="relative z-20 w-full py-2">
      <NuxtMarquee :pause-on-hover="true">
        <div class="flex w-full items-center justify-center gap-12">
          <template v-for="(icon, index) in icons" :key="index">
            <div class="size-auto items-center justify-center p-2">
              <UIcon
                :name="icon"
                class="size-16 text-dark-500/50 dark:text-dark-50/20"
              />
            </div>
          </template>
        </div>
      </NuxtMarquee>
    </div>
  </div>
</template>
