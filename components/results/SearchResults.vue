<script setup lang="ts">
import CopyButton from './CopyButton.vue'
import SearchResult from './SearchResult.vue'

defineProps({
  searchResults: {
    type: Array as PropType<SearchResult[]>,
  },
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-6rem)] w-full">
    <div class="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center shrink-0">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
        Search Results
      </h3>
      <CopyButton :data="searchResults" />
    </div>
    <div class="flex-1 min-h-0 overflow-y-auto p-3 w-full">
      <div v-if="searchResults">
        <div v-for="searchResult in searchResults" :key="searchResult.title">
          <SearchResult :search-result="searchResult" />
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500 dark:text-gray-400">
          No search results.
        </p>
      </div>
    </div>
  </div>
</template>
