<script setup lang="ts">
import CopyButtonHeader from './CopyButtonHeader.vue'
import SearchResult from './SearchResult.vue'

defineProps({
  searchResults: {
    type: Array as PropType<SearchResult[]>,
  },
})
</script>

<template>
  <UPage>
    <CopyButtonHeader :data="searchResults" title="Search Results" />
    <UPageBody v-if="searchResults">
      <div v-for="searchResult in searchResults" :key="searchResult.title">
        <SearchResult :search-result="searchResult" />
        <UDivider />
      </div>
    </UPageBody>
    <UPageBody v-else>
      <p class="text-gray-500 dark:text-gray-400">
        No search results.
      </p>
    </UPageBody>
  </UPage>
</template>
