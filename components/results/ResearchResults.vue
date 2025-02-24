<script setup lang="ts">
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
  click: () => {
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
  click: () => {
    showResearchResults.value = false
    showSearchResults.value = true
    activeLink.value = 'searchResult'
  },
}

const restartLink = {
  label: 'Restart',
  icon: 'i-mdi-restart',
  click: () => emit('restart'),
}

const links = computed(() => [
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
  <div class="flex h-full">
    <div class="w-fit">
      <UVerticalNavigation
        :links="links"
      />
    </div>
    <div class="flex-1 overflow-auto">
      <ExtractedResult
        v-if="showResearchResults"
        :html="formattedHtml"
        :data="data"
      />
      <SearchResults
        v-if="showSearchResults"
        :search-results="data.searchResults"
      />
    </div>
  </div>
</template>
