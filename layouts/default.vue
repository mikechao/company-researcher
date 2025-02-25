<script setup lang="ts">
const links = [
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
  <UHeader :links="links">
    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
  <UMain>
    <NuxtPage />
  </UMain>
</template>
