<script setup>
/**
 * Accepts any JSON data (object, array, or primitive)
 */
defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true,
  },
})

/**
 * Check if a value is a non-null object (and not an array)
 */
function isObject(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/**
 * Check if a value is an array
 */
function isArray(val) {
  return Array.isArray(val)
}

/**
 * Format a key by replacing underscores with spaces and capitalizing each word.
 */
function formatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
</script>

<template>
  <UCard
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
          <ResearchResults :data="value" />
        </template>
        <template v-else-if="isArray(value)">
          <!-- For arrays, join the values or render each item recursively -->
          <span class="text-gray-600 dark:text-gray-400">{{ value.join(', ') }}</span>
        </template>
        <template v-else>
          <span class="text-gray-600 dark:text-gray-400">{{ value }}</span>
        </template>
      </div>
    </template>

    <!-- If the data is an array -->
    <template v-else-if="isArray(data)">
      <div v-for="(item, index) in data" :key="index" class="mb-2 pl-4 ">
        <ResearchResults :data="item" />
      </div>
    </template>

    <!-- If the data is a primitive -->
    <template v-else>
      <span class="text-gray-600">{{ data }}</span>
    </template>
  </UCard>
</template>
