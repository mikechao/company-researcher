<script setup lang="ts">
import CopyButtonHeader from './CopyButtonHeader.vue'

defineProps({
  html: {
    type: String,
    required: true,
  },
  data: {
    type: Object as PropType<ResearchResults>,
    required: true,
  },
})
</script>

<template>
  <UPage>
    <CopyButtonHeader :data="data" title="Research Results" />

    <UPageBody>
      <div v-html="html" />
    </UPageBody>
  </UPage>
</template>
