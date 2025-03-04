<script setup lang="ts">
import { jsonLanguage } from '@codemirror/lang-json'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import CopyButton from '~/components/results/CopyButton.vue'
import { complexSchema } from '~/types/constants'

const extensions = [jsonLanguage]
const complexSchemaJSON = JSON.stringify(complexSchema, null, 2)
</script>

<template>
  <div class="relative flex flex-col h-full w-full bg-dark-50 dark:bg-dark-950 mt-4 px-4">
    <!-- Header with title and copy button -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">
        Complex Report Schema
      </h1>

      <CopyButton :data="complexSchema" />
    </div>

    <div class="w-full flex-1 overflow-auto">
      <NuxtCodeMirror
        v-model="complexSchemaJSON"
        :extensions="extensions"
        :theme="okaidia"
        :auto-focus="true"
        :editable="true"
        :basic-setup="true"
        :indent-with-tab="true"
        class="h-[80vh]"
      />
    </div>
  </div>
</template>
