<script setup lang="ts">
import { jsonLanguage } from '@codemirror/lang-json'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { complexSchema } from '~/types/constants'

const extensions = [jsonLanguage]
const complexSchemaJSON = JSON.stringify(complexSchema, null, 2)
</script>

<template>
  <NuxtCodeMirror
    v-model="complexSchemaJSON"
    :extensions="extensions"
    :theme="okaidia"
    :auto-focus="true"
    :editable="false"
    :basic-setup="true"
    :indent-with-tab="true"
    class="w-full h-full overflow-auto"
  />
</template>
