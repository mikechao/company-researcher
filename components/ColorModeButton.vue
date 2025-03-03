<script setup>
const color = useColorMode()
function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <UButton
      aria-label="button to switch theme dark to light" variant="link" class="cursor-pointer" color="primary"
      size="lg" :icon="color.preference === 'dark'
        ? 'i-mdi-weather-sunny'
        : 'i-mdi-weather-night'
      " @click="toggleDark"
    />
  </ClientOnly>
</template>
