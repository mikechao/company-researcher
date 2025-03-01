<script setup lang="ts">
import { UNavigationMenu } from '#components'
import ExtractedResult from './ExtractedResult.vue'
import SearchResults from './SearchResults.vue'

const props = defineProps({
  data: {
    type: Object as PropType<ResearchResults>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'restart', value: void): void
}>()

const formattedHtml = formatJson(props.data.info)

const showResearchResults = ref(true)
const showSearchResults = ref(false)

const activeLink = ref('researchResult')

// VerticalNavigationLink
const researchResultLink = {
  label: 'Research Results',
  icon: 'i-mdi-file-document-outline',
  get active() {
    return activeLink.value === 'researchResult'
  },
  onSelect: () => {
    showResearchResults.value = true
    showSearchResults.value = false
    activeLink.value = 'researchResult'
  },
}

const searchResultLink = {
  label: 'Search Results',
  icon: 'i-mdi-clipboard-text-search-outline',
  get active() {
    return activeLink.value === 'searchResult'
  },
  onSelect: () => {
    showResearchResults.value = false
    showSearchResults.value = true
    activeLink.value = 'searchResult'
  },
}

const restartLink = {
  label: 'Restart',
  icon: 'i-mdi-restart',
  onSelect: () => emit('restart'),
}

const items = computed(() => [
  [
    researchResultLink,
    searchResultLink,
  ],
  [
    restartLink,
  ],
])

/**
 * Check if a value is a non-null object (and not an array)
 */
function isObject(val: any) {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

/**
 * Format a key by replacing underscores with spaces and capitalizing each word.
 */
function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function formatJson(info: Record<string, any>): string {
  if (Array.isArray(info)) {
    const items = info.map(item => `<li class="mb-1">${formatJson(item)}</li>`).join('')
    return `<ul class="list-disc ml-5">${items}</ul>`
  }
  else if (isObject(info)) {
    const items = Object.entries(info).map(([key, value]) => `
      <li class="mb-1">
        <span class="font-bold text-primary">${formatKey(key)}</span>: ${formatJson(value)}
      </li>
    `).join('')
    return `<ul class="list-none ml-4">${items}</ul>`
  }
  else {
    return String(info)
  }
}
</script>

<template>
  <div class="flex w-full h-full">
    <div class="w-fit">
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="sticky top-20"
      />
    </div>
    <div class="flex-1 overflow-auto">
      <transition-fade>
        <ExtractedResult
          v-if="showResearchResults"
          :html="formattedHtml"
          :data="data"
        />
      </transition-fade>
      <transition-fade>
        <SearchResults
          v-if="showSearchResults"
          :search-results="data.searchResults"
          class="w-full"
        />
      </transition-fade>
    </div>
  </div>
</template>
