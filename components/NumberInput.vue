<script setup lang="ts">
interface Props {
  modelValue: number
  min: number
  max: number
  step?: number
  label?: string
  name?: string
  disable: boolean
  defaultValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

function updateValue(value: string | number) {
  // Convert to number and ensure it's within bounds
  const numValue = Number(value)
  if (!Number.isNaN(numValue)) {
    const boundedValue = Math.min(Math.max(numValue, props.min), props.max)
    emit('update:modelValue', boundedValue)
  }
}
</script>

<template>
  <UFormField :label="label" :name="name">
    <UInput
      :model-value="modelValue"
      type="number"
      color="primary"
      variant="outline"
      :min="min"
      :max="max"
      :step="step ?? 1"
      :disabled="disable"
      @update:model-value="updateValue"
    />
    <UButton
      label="Default"
      color="primary"
      class="mt-1"
      size="xs"
      :disabled="disable"
      @click="updateValue(defaultValue)"
    />
  </UFormField>
</template>
