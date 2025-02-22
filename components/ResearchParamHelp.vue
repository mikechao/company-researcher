<script setup lang="ts">
defineProps({
  paramName: String,
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <UIcon name="i-mdi-help-circle" class="text-primary w-8 h-8" />
    <div class="p-4">
      <p class="text-sm">
        {{ paramName }}
        This is a research tool that generates queries, executes them, and generates notes based on the results.
      </p>
      <p class="text-sm">
        The tool is designed to help you understand how to use the AI SDK to build your own research tools.
      </p>
    </div>
  </div>
</template>
