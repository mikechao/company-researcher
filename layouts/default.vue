<script setup lang="ts">
import ColorModeButton from '~/components/ColorModeButton.vue'

const items = [
  {
    label: 'Home',
    icon: 'i-mdi-home',
    to: '/',
  },
  {
    label: 'Research',
    icon: 'i-mdi-microscope',
    to: '/research',
  },
]
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      <UNavigationMenu :items="items" />
      <ColorScheme placeholder="..." tag="span" class="mr-2">
        <ColorModeButton class="mr-2" />
      </ColorScheme>
    </div>
    <div class="flex-1 overflow-auto bg-white dark:bg-gray-900">
      <slot />
    </div>
  </div>
</template>
