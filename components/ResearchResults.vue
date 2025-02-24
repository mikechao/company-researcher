<script setup lang="ts">
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

interface ButtonState {
  text: string
  icon: string
}

const defaultState: ButtonState = {
  text: 'Copy Raw Data',
  icon: 'i-mdi-content-copy',
}

const copiedState: ButtonState = {
  text: 'Copied!',
  icon: 'i-mdi-check',
}

const buttonState = ref<ButtonState>(defaultState)

// VerticalNavigationLink
const researchResultLink = {
  label: 'Research Results',
  icon: 'i-mdi-file-document-outline',
  active: true,
}

const searchResultLink = {
  label: 'Search Results',
  icon: 'i-mdi-clipboard-text-search-outline',
}

const restartLink = {
  label: 'Restart',
  icon: 'i-mdi-restart',
  click: () => emit('restart'),
}

const links = [
  [
    researchResultLink,
    searchResultLink,
  ],
  [
    restartLink,
  ],
]

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
      <li class="mb-2">
        <span class="font-bold text-primary">${formatKey(key)}</span>: ${formatJson(value)}
      </li>
    `).join('')
    return `<ul class="list-none ml-4">${items}</ul>`
  }
  else {
    return String(info)
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
  buttonState.value = copiedState
  setTimeout(() => {
    buttonState.value = defaultState
  }, 2000)
}
</script>

<template>
  <UVerticalNavigation
    :links="links"
    class="mb-4"
  />
  <ExtractedResult
    :data="data"
    :html="formattedHtml"
  />
</template>
