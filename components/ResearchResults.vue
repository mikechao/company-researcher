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

function copyToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
}

function asArray(item: any) {
  return item as unknown[]
}
</script>

<template>
  <UCard
    ref="card"
    class="p-4" :ui="{
      ring: 'ring-1 ring-inset ring-primary-500 dark:ring-primary-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    }"
  >
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

    <!-- Buttons section - only shown for root instance -->
    <template v-if="isRoot" #footer>
      <div class="flex justify-start mt-1">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-mdi-content-copy"
          @click="copyToClipboard"
        >
          Copy Raw Data
        </UButton>
      </div>
    </template>
  </UCard>
</template>
