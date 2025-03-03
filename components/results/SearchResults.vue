<script setup lang="ts">
import SearchResult from './SearchResult.vue'

defineProps({
  searchResults: {
    type: Array as PropType<SearchResult[]>,
  },
})
</script>

<template>
  <div class="flex flex-col ">
    <div class="flex-1 min-h-0 overflow-y-auto p-3">
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
