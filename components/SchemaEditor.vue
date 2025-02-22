<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'close': []
}>()

const localSchema = ref(props.modelValue)
const windowHeight = ref(window.innerHeight)

const optimalRows = computed(() => {
  // Assuming each row is roughly 24px (typical line-height)
  // and accounting for modal header/footer (approximately 150px)
  const availableHeight = windowHeight.value - 150
  return Math.floor(availableHeight / 24)
})

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

onMounted(() => {
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
})
</script>

<template>
  <UModal :model-value="props.isOpen" fullscreen>
    <UCard :ui="{ ring: 'app-ring' }">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300">
            Edit Schema
          </h3>
          <UButton color="gray" variant="ghost" icon="i-mdi-close-circle-outline" class="-my-1" @click="emit('close')" />
        </div>
      </template>

      <UTextarea
        v-model="localSchema"
        color="primary"
        variant="outline"
        font-mono
        class="w-full h-full min-h-[50vh]"
        :rows="optimalRows"
        resize
      />

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
