<script setup lang="ts">
/**
 * Accepts any JSON data (object, array, or primitive)
 */
const props = defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'restart', value: void): void
}>()

const formattedHtml = computed(() => formatJson(props.data))

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

function formatJson(data: any): string {
  if (Array.isArray(data)) {
    let html = `<ul class="list-disc ml-5">`
    data.forEach((item) => {
      html += `<li class="mb-1">${formatJson(item)}</li>`
    })
    html += `</ul>`
    return html
  }
  else if (isObject(data)) {
    let html = `<ul class="list-none ml-4">`
    for (const key in data) {
      html += `<li class="mb-2">
                <span class="font-bold text-primary">${formatKey(key)}</span>: ${formatJson(data[key])}
              </li>`
    }
    html += `</ul>`
    return html
  }
  else {
    return `${data}`
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
  <UCard
    :ui="{
      ring: 'app-ring',
      header: {
        padding: 'px-3 py-3',
      },
      body: {
        padding: 'px-3 py-3',
      },
      footer: {
        padding: 'px-3 py-3',
      },
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
          Research Results
        </h3>
        <UButton
          :label="buttonState.text"
          color="gray"
          variant="ghost"
          :icon="buttonState.icon"
          @click="copyToClipboard"
        />
      </div>
    </template>
    <div v-html="formattedHtml" />
    <template #footer>
      <UButton
        label="Restart"
        icon="i-mdi-restart"
        :trailing="true"
        color="primary"
        @click="() => emit('restart')"
      />
    </template>
  </UCard>
</template>
