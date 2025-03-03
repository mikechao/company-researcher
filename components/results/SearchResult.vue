<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  searchResult: {
    type: Object as PropType<SearchResult>,
    required: true,
  },
})

const displayUrl = computed(() => {
  try {
    const url = new URL(props.searchResult.url)
    return url.hostname + url.pathname.substring(0, 20) + (url.pathname.length > 20 ? '...' : '')
  }
  catch {
    return props.searchResult.url.substring(0, 30) + (props.searchResult.url.length > 30 ? '...' : '')
  }
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
  <UCard
    variant="soft" class="mb-2" :ui="{
      header: 'p-2',
    }"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="font-medium text-lg">{{ searchResult.title }}</span>
        <UBadge :color="searchResult.score > 0.8 ? 'success' : searchResult.score > 0.5 ? 'info' : 'neutral'">
          {{ (searchResult.score * 100).toFixed(1) }}%
        </UBadge>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div class="flex items-center flex-wrap gap-2">
        <span class="font-semibold text-primary mr-1">URL:</span>
        <span class="text-sm text-gray-600 dark:text-gray-300 break-all mr-1">
          {{ displayUrl }}
        </span>
        <UButton
          :to="searchResult.url"
          target="_blank"
          label="Open"
          size="xs"
          icon="i-mdi-open-in-new"
          :trailing="true"
          variant="soft"
        />
      </div>
      <UAccordion
        :items="items"
      />
    </div>
  </UCard>
</template>
