<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  searchResult: {
    type: Object as PropType<SearchResult>,
    required: true,
  },
})

const items = [{
  label: 'Content',
  content: props.searchResult.content,
}]

if (props.searchResult.rawContent) {
  items.push({
    label: 'Raw Content',
    content: props.searchResult.rawContent,
  })
}
</script>

<template>
  <div class="flex flex-col space-y-1 mb-2">
    <div class="flex">
      <span class="font-bold text-primary mr-2">Title:</span>
      <span>{{ searchResult.title }}</span>
    </div>
    <div class="flex">
      <span class="font-bold text-primary mr-2">URL:</span>
      <UButton
        :to="searchResult.url"
        target="_blank"
        label="New Tab"
        size="xs"
        icon="i-mdi-open-in-new"
        :trailing="true"
      />
    </div>
    <div class="flex">
      <span class="font-bold text-primary mr-2">Score:</span>
      <span>{{ searchResult.score }}</span>
    </div>
    <UAccordion :items="items" />
  </div>
</template>
