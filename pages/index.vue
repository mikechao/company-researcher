<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

const companyName = ref('Apple')
const isLoading = ref(false)

async function research() {
  isLoading.value = true
  try {
    const response = await $fetch<ReadableStream>('/api/research', {
      method: 'POST',
      body: { // $fetch automatically stringifies the body
        sessionId: uuidv4(),
        company: companyName.value,
        maxSearchQueries: 3,
        maxSearchResults: 3,
        maxReflectionSteps: 0,
        includeSearchResults: true,
      },
      responseType: 'stream',
    })
    const reader = response.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        isLoading.value = false
        break
      }

      console.log('Received:', value)
    }
  }
  catch (error: any) {
    console.error('Error:', error.data || error.message)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UCard class="justify-center h-screen">
    <div class="flex flex-col items-center">
      <div class="flex items-center">
        <label for="company-name" class="mr-2">Company Name</label>
        <UInput
          id="company-name"
          v-model="companyName"
          label="Company Name"
          placeholder="Enter company name"
          color="primary"
          variant="outline"
          :disabled="true"
        />
      </div>
      <UButton
        label="Research"
        icon="i-mdi-microscope"
        loading-icon="i-mdi-loading"
        :trailing="true"
        color="primary"
        class="mt-4"
        :loading="isLoading"
        @click="research"
      />
    </div>
  </UCard>
</template>
