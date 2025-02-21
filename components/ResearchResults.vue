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
  <div class="json-item">
    <!-- If the data is an object -->
    <template v-if="isObject(data)">
      <div v-for="(value, key) in data" :key="key" class="json-item">
        <span class="json-key">{{ formatKey(key) }}:</span>
        <template v-if="isObject(value)">
          <!-- Recursively render nested objects -->
          <ResearchResults :data="value" />
        </template>
        <template v-else-if="isArray(value)">
          <!-- For arrays, join the values or render each item recursively -->
          <span>{{ value.join(', ') }}</span>
        </template>
        <template v-else>
          <span>{{ value }}</span>
        </template>
      </div>
    </template>

    <!-- If the data is an array -->
    <template v-else-if="isArray(data)">
      <div v-for="(item, index) in data" :key="index" class="json-item">
        <ResearchResults :data="item" />
      </div>
    </template>

    <!-- If the data is a primitive -->
    <template v-else>
      <span>{{ data }}</span>
    </template>
  </div>
</template>

<style scoped>
.json-item {
  margin-bottom: 8px;
  padding-left: 16px;
  border-left: 2px solid #eee;
}

.json-key {
  font-weight: bold;
  margin-right: 4px;
}
</style>
