<script setup lang="ts">
defineProps({
  searchResults: {
    type: Array as PropType<Record<string, any>>,
  },
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-6rem)]">
    <div class="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center shrink-0">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
        Search Results
      </h3>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto p-3">
      <div v-if="searchResults">
        <ul class="list-disc ml-5">
          <li v-for="(result, index) in searchResults" :key="index" class="mb-1">
            <ul class="list-none ml-4">
              <li v-for="([key, value]) in Object.entries(result)" :key="key" class="mb-1">
                <span class="font-bold text-primary">{{ key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) }}</span>: {{ value }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
