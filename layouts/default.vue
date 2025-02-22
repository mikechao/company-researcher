<script setup lang="ts">
const links = [{
  label: 'Research',
  icon: 'i-mdi-microscope',
  to: '/',
}]
</script>

<template>
  <div class="overflow-hidden">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
    <slot />
  </div>
</template>
