<script setup lang="ts">
import type { NuxtError } from '#app'
import type { PropType } from 'vue'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    default: () => ({ statusCode: 500, message: 'An error occurred' }),
  },
})

// Clear error and return to homepage
function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <UCard class="max-w-md w-full">
        <template #header>
          <div class="flex items-center gap-2">
            <span class="i-mdi-alert-circle text-2xl text-red-500" />
            <h1 class="text-xl font-bold">
              Error {{ error.statusCode }}
            </h1>
          </div>
        </template>

        <p class="text-lg font-medium mb-2">
          {{ error.message }}
        </p>

        <div v-if="error.statusCode === 503">
          <p>We're unable to connect to a required service.</p>
          <p class="text-sm text-gray-500">
            This might be a temporary issue. Please try again in a few moments.
          </p>
        </div>
        <div v-else>
          <p>Something unexpected happened.</p>
          <p class="text-sm text-gray-500">
            Our team has been notified and is working on a fix.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="primary" @click="handleError">
              Return to Home
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </NuxtLayout>
</template>
