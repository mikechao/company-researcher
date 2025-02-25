<script setup lang="ts">
const items = [
  {
    label: 'Research',
    icon: 'i-mdi-microscope',
    to: '/research',
  },
]
</script>

<template>
  <UHeader title="Company Researcher">
    <UNavigationMenu
      :items="items"
    />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
