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
  <div class="flex flex-col h-[calc(100vh-6rem)]">
    <div class="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center shrink-0">
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

    <!-- Body -->
    <div class="flex-1 min-h-0 overflow-y-auto p-3">
      <div v-html="html" />
    </div>
  </div>
</template>
