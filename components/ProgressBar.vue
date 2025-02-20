<script setup lang="ts">
defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <UProgress
    size="lg"
    :value="value"
    :max="max"
    indicator
  >
    <template #step-0="{ step }">
      <span class="text-primary">
        {{ step }}
      </span>
    </template>
  </UProgress>
</template>
