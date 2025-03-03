<script setup lang="ts">
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
    <!-- Body -->
    <div class="flex-1 min-h-0 overflow-y-auto p-3">
      <div v-html="html" />
    </div>
  </div>
</template>
