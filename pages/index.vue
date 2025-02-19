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
        :trailing="true"
        color="primary"
        class="mt-4"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const companyName = ref('Apple')
</script>