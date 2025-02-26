<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any> | undefined>,
    required: true,
  },
  title: {
    type: String,
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

const button = reactive({
  label: defaultState.text,
  color: 'gray' as const,
  variant: 'ghost' as const,
  icon: defaultState.icon,
  click: copyToClipboard,
  disabled: false,
})

function copyToClipboard() {
  if (props.data) {
    navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
    button.label = copiedState.text
    button.icon = copiedState.icon

    setTimeout(() => {
      button.label = defaultState.text
      button.icon = defaultState.icon
    }, 2000)
  }
}
onMounted(() => {
  if (!props.data) {
    button.label = noDataState.text
    button.icon = noDataState.icon
    button.disabled = true
  }
})
</script>

<template>
  <UPageHeader
    :title="title"
    :links="[
      button,
    ]"
  />
</template>
