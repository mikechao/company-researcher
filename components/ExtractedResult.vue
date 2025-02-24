<script setup lang="ts">
const props = defineProps({
  html: {
    type: String,
    required: true,
  },
  data: {
    type: Object as PropType<ResearchResults>,
    required: true,
  },
})

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

function copyToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
  buttonState.value = copiedState
  setTimeout(() => {
    buttonState.value = defaultState
  }, 2000)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
        Research Results
      </h3>
      <button
        class="py-1 px-2 border rounded bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        @click="copyToClipboard"
      >
        {{ buttonState.text }}
      </button>
    </div>

    <!-- Body -->
    <div class="p-3">
      <div v-html="html" />
    </div>
  </div>
</template>
