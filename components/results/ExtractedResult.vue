<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps({
  html: {
    type: String,
    required: true,
  },
  data: {
    type: Object as PropType<ResearchResults>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-6rem)]">
    <div class="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center shrink-0">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
        Research Results
      </h3>
      <CopyButton :data="data.info" />
    </div>

    <!-- Body -->
    <div class="flex-1 min-h-0 overflow-y-auto p-3">
      <div v-html="html" />
    </div>
  </div>
</template>
