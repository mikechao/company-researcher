<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any> | undefined>,
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

const noDataState: ButtonState = {
  text: 'No Data',
  icon: 'i-mdi-alphabetical-off',
}

const buttonState = ref<ButtonState>(defaultState)

function copyToClipboard() {
  if (props.data) {
    navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
    buttonState.value = copiedState
    setTimeout(() => {
      buttonState.value = defaultState
    }, 2000)
  }
}

onMounted(() => {
  if (!props.data) {
    buttonState.value = noDataState
  }
})
</script>

<template>
  <UButton
    :label="buttonState.text"
    color="gray"
    variant="ghost"
    :icon="buttonState.icon"
    @click="copyToClipboard"
  />
</template>
