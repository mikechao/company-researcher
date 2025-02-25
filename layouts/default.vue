<script setup lang="ts">
const links = [
  {
    label: 'Research',
    icon: 'i-mdi-microscope',
    to: '/research',
  },
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Company Researcher
    </template>
    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
  <UMain>
    <NuxtPage />
  </UMain>
</template>
