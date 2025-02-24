<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  searchResult: {
    type: Object as PropType<SearchResult>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex">
      <span class="font-bold text-primary mr-2">Title:</span>
      <span>{{ searchResult.title }}</span>
    </div>
    <div class="flex">
      <span class="font-bold text-primary mr-2">URL:</span>
      <span>{{ searchResult.url }}</span>
    </div>
  </div>
</template>
