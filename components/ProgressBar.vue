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
    <!-- index.steps[0] Waiting... -->
    <template #step-0="{ step }">
      <span class="text-primary">
        <UIcon name="i-mdi-loading" class="animate-spin" /> {{ step }}
      </span>
    </template>
    <!-- index.steps[1] EVENT_NAMES.GENERATED_QUERIES -->
    <template #step-1>
      <span class="text-primary">
        <UIcon name="i-mdi-file-document-edit-outline" /> Generated Queries
      </span>
    </template>
    <!-- index.steps[2] EVENT_NAMES.EXECUTED_QUERIES -->
    <template #step-2>
      <span class="text-primary">
        <UIcon name="i-mdi-text-search-variant" /> Executed Queries
      </span>
    </template>
    <!-- index.steps[3] EVENT_NAMES.GENERATED_NOTES -->
    <template #step-3>
      <span class="text-primary">
        <UIcon name="i-mdi-notebook-edit-outline" /> Generated Notes
      </span>
    </template>
    <!-- index.steps[4] EVENT_NAMES.NOTES_TO_SCHEMA -->
    <template #step-4>
      <span class="text-primary">
        <UIcon name="i-mdi-invoice-text-arrow-left-outline" /> Notes to Schema
      </span>
    </template>
    <!--  index.steps[5]  EVENT_NAMES.REFLECTION -->
    <template #step-5>
      <span class="text-primary">
        <UIcon name="i-mdi-reflect-vertical" /> Reflection
      </span>
    </template>
    <!--  index.steps[6] EVENT_NAMES.END -->
    <template #step-6>
      <span class="text-success">
        <UIcon name="i-mdi-check" /> Finished
      </span>
    </template>
  </UProgress>
</template>
