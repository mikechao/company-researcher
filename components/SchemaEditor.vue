<script setup lang="ts">
import { jsonLanguage } from '@codemirror/lang-json'
import { okaidia } from '@uiw/codemirror-theme-okaidia'

const props = defineProps<{
  modelValue: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'close': []
}>()

const extensions = [jsonLanguage]

const localSchema = ref(props.modelValue)

function save() {
  try {
    // Validate it's valid JSON
    JSON.parse(localSchema.value)
    emit('update:modelValue', localSchema.value)
    emit('close')
  }
  catch (e) {
    // Handle invalid JSON
    console.error('Invalid JSON schema', e)
  }
}
</script>

<template>
  <UModal
    :open="isOpen"
    fullscreen
    title="Edit Schema"
    close-icon="i-mdi-close-circle-outline"
    @update:open="emit('close')"
  >
    <template #body>
      <div class="w-full h-full overflow-auto">
        <NuxtCodeMirror
          v-model="localSchema"
          :extensions="extensions"
          :theme="okaidia"
          :auto-focus="true"
          :editable="true"
          :basic-setup="true"
          :indent-with-tab="true"
          style="width: 100%; height: 100%;"
        />
      </div>
    </template>
    <template #footer>
      <UButton
        color="neutral"
        variant="ghost"
        @click="emit('close')"
      >
        Cancel
      </UButton>
      <UButton
        color="primary"
        @click="save"
      >
        Save
      </UButton>
    </template>
  </UModal>
</template>
