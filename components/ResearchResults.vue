<script setup lang="ts">
/**
 * Accepts any JSON data (object, array, or primitive)
 */
const props = defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true,
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'restart', value: void): void
}>()

/**
 * Check if a value is a non-null object (and not an array)
 */
function isObject(val: any) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/**
 * Check if a value is an array
 */
function isArray(val: unknown): val is unknown[] {
  return Array.isArray(val)
}

/**
 * Format a key by replacing underscores with spaces and capitalizing each word.
 */
function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

const card: Ref<HTMLElement | null> = ref(null)

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

function asArray(item: any) {
  return item as unknown[]
}
</script>

<template>
  <UCard
    ref="card"
    class="p-4"
    :ui="{
      ring: 'app-ring',
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300">
          {{ isRoot ? 'Research Results' : '' }}
        </h3>
        <UButton
          v-if="isRoot"
          :label="buttonState.text"
          color="gray"
          variant="ghost"
          :icon="buttonState.icon"
          @click="copyToClipboard"
        />
      </div>
    </template>
    <!-- If the data is an object -->
    <template v-if="isObject(data)">
      <div v-for="(value, key) in data" :key="key" class="mb-2 pl-4 ">
        <span class="font-semibold text-gray-700 dark:text-gray-300 mr-2">{{ formatKey(key) }}:</span>
        <template v-if="isObject(value)">
          <!-- Recursively render nested objects -->
          <ResearchResults :data="value" :is-root="false" />
        </template>
        <template v-else-if="isArray(value)">
          <!-- For arrays, join the values or render each item recursively -->
          <span class="text-gray-600 dark:text-gray-400">{{ (value as unknown[]).join(', ') }}</span>
        </template>
        <template v-else>
          <span class="text-gray-600 dark:text-gray-400">{{ value }}</span>
        </template>
      </div>
    </template>

    <!-- If the data is an array -->
    <template v-else-if="isArray(data)">
      <div v-for="(item, index) in data" :key="index" class="mb-2 pl-4 ">
        <ResearchResults :is-root="false" :data="asArray(item)" />
      </div>
    </template>
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
