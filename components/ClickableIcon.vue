<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="size-auto items-center justify-center p-2">
    <a
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      class="border-dark-950/20 bg-dark-200/20 dark:border-dark-700 dark:bg-dark-800 flex size-16 items-center justify-center rounded-md border p-1"
    >
      <UIcon :name="icon" class="size-16 text-dark-500/50 dark:text-dark-50/20" />
    </a>
  </div>
</template>
