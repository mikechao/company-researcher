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
  <UModal :model-value="props.isOpen" fullscreen>
    <UCard
      :ui="{
        ring: 'app-ring',
        base: 'h-full flex flex-col',
        header: {
          base: 'shrink-0',
          padding: 'px-4 py-3',
        },
        body: {
          base: 'flex-1 overflow-hidden',
          padding: 'p-0',
        },
        footer: {
          base: 'shrink-0',
          padding: 'px-4 py-3',
        },
      }"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300">
            Edit Schema
          </h3>
          <UButton color="gray" variant="ghost" icon="i-mdi-close-circle-outline" class="-my-1" @click="emit('close')" />
        </div>
      </template>

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

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
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
        </div>
      </template>
    </UCard>
  </UModal>
</template>
