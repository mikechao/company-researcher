<script setup lang="ts">
import CopyButton from './CopyButton.vue'
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

const tabItems = [
  {
    label: 'Research Results',
    icon: 'i-mdi-file-document-outline',
    slot: 'researchResult',
  },
  {
    label: 'Search Results',
    icon: 'i-mdi-clipboard-text-search-outline',
    slot: 'searchResult',
  },
]
const activeTab = ref('0')

const dataToCopy = computed(() => {
  if (activeTab.value === '0') {
    return props.data.info
  }
  return props.data.searchResults
})

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
  <div class="flex flex-col w-full">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
      <!-- Hide on mobile (screens smaller than sm breakpoint), show on sm and larger -->
      <UTabs v-model="activeTab" :items="tabItems" variant="link" class="hidden sm:block w-fit lg:flex" />
      <!-- Show a simple dropdown/select on mobile only -->
      <USelect
        v-model="activeTab"
        value-key="id"
        :items="[
          { label: 'Research Results', id: '0' },
          { label: 'Search Results', id: '1' },
        ]"
        icon="i-mdi-check"
        placeholder="Select tab"
        class="w-fit sm:hidden mb-2"
      />

      <div class="flex">
        <CopyButton :data="dataToCopy" />
        <UButton
          label="Restart"
          icon="i-mdi-restart"
          :trailing="true"
          color="primary"
          @click="emit('restart')"
        />
      </div>
    </div>
    <div v-if="activeTab === '0'" class="w-full">
      <ExtractedResult
        :html="formattedHtml"
        :data="data"
      />
    </div>
    <div v-if="activeTab === '1'" class="w-full">
      <SearchResults
        :search-results="data.searchResults"
        class="w-full"
      />
    </div>
  </div>
</template>
