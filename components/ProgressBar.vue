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
    <!-- index.steps[1] EVENT_NAMES.GENERATE_QUERIES -->
    <template #step-1>
      <span class="text-primary">
        <UIcon name="i-mdi-file-document-edit-outline" /> Generating Queries
      </span>
    </template>
    <!-- index.steps[2] EVENT_NAMES.BEFORE_EXECUTE_QUERIES -->
    <template #step-2>
      <span class="text-primary">
        <UIcon name="i-mdi-text-search-variant" /> Before Executing Queries
      </span>
    </template>
    <!-- index.steps[3] EVENT_NAMES.AFTER_EXECUTE_QUERIES -->
    <template #step-3>
      <span class="text-primary">
        <UIcon name="i-mdi-text-search" /> After Executing Queries
      </span>
    </template>
    <!-- index.steps[4] EVENT_NAMES.GENERATE_NOTES -->
    <template #step-4>
      <span class="text-primary">
        <UIcon name="i-mdi-notebook-edit-outline" /> Generating Notes
      </span>
    </template>
    <!--  index.steps[5] EVENT_NAMES.BEFORE_NOTES_TO_SCHEMA -->
    <template #step-5>
      <span class="text-primary">
        <UIcon name="i-mdi-invoice-text-arrow-right-outline" /> Before Notes to Schema
      </span>
    </template>
    <!--  index.steps[6] EVENT_NAMES.AFTER_NOTES_TO_SCHEMA -->
    <template #step-6>
      <span class="text-primary">
        <UIcon name="i-mdi-invoice-text-arrow-left-outline" /> After Notes to Schema
      </span>
    </template>
    <!--  index.steps[7] EVENT_NAMES.BEFORE_REFLECTION -->
    <template #step-7>
      <span class="text-primary">
        <UIcon name="i-mdi-reflect-vertical" class="animate-spin" /> Before Reflection
      </span>
    </template>
    <!--  index.steps[8] EVENT_NAMES.AFTER_REFLECTION -->
    <template #step-8>
      <span class="text-primary">
        <UIcon name="i-mdi-reflect-vertical" class="animate-spin" /> After Reflection
      </span>
    </template>
    <!-- index.steps[9] EVENT_NAMES.END -->
    <template #step-9>
      <span class="text-success">
        <UIcon name="i-mdi-check" /> Finished
      </span>
    </template>
  </UProgress>
</template>
