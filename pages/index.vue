<template>
  <UCard class="justify-center h-screen">
    <div class="flex flex-col items-center">
      <div class="flex items-center">
        <label for="company-name" class="mr-2">Company Name</label>
        <UInput
          v-model="companyName"
          label="Company Name"
          placeholder="Enter company name"
          color="primary"
          variant="outline"
          id="company-name"
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
        @click="research"
        :loading="isLoading"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { set } from 'zod'

const companyName = ref('Apple')
const isLoading = ref(false)

async function research() {
  isLoading.value = true
  const response = await $fetch('/api/research', {
    method: 'POST',
    body: JSON.stringify({
      company: companyName.value,
      maxSearchQueries: 3,
      maxSearchResults: 3,
      maxReflectionSteps: 0,
      includeSearchResults: true,
    })
  })
  console.log(`got response ${response}`)
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>