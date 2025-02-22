<script setup lang="ts">
import ColorModeButton from '~/components/ColorModeButton.vue'

const links = [
  {
    label: 'Research',
    icon: 'i-mdi-microscope',
    to: '/',
  },
]
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      <UHorizontalNavigation :links="links" />
      <ColorScheme placeholder="..." tag="span" class="mr-2">
        <ColorModeButton class="mr-2" />
      </ColorScheme>
    </div>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>
