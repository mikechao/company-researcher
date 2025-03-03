<script setup lang="ts">
defineProps({
  value: {
    type: Number,
    required: true,
  },
})

const max = [
  'Waiting to start...',
  'Generated Queries',
  'Executed Queries',
  'Generated Notes',
  'Notes to Schema',
  'Reflection',
  'Finished',
]
</script>

<template>
  <UProgress
    :model-value="value"
    size="lg"
    :max="max"
    status
  />
</template>
