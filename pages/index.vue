<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { v4 as uuidv4 } from 'uuid'
import { EVENT_NAMES } from '~/types/constants'

const companyName = ref('Apple')
const isLoading = ref(false)

const task = ref(0)
const steps = [
  'Waiting...',
  EVENT_NAMES.GENERATE_QUERIES,
  EVENT_NAMES.BEFORE_EXECUTE_QUERIES,
  EVENT_NAMES.AFTER_EXECUTE_QUERIES,
  EVENT_NAMES.GENERATE_NOTES,
  EVENT_NAMES.BEFORE_NOTES_TO_SCHEMA,
  EVENT_NAMES.AFTER_NOTES_TO_SCHEMA,
  EVENT_NAMES.BEFORE_REFLECTION,
  EVENT_NAMES.AFTER_REFLECTION,
  EVENT_NAMES.END,
]
const sessionId = uuidv4()
const { data, append } = useChat({
  api: '/api/research',
  body: {
    sessionId,
    company: companyName.value,
    maxSearchQueries: 3,
    maxSearchResults: 3,
    maxReflectionSteps: 0,
    includeSearchResults: true,
  },
})

async function research() {
  isLoading.value = true
  try {
    // use append to trigger call the research endpoint
    // the message is ignored by the server
    await append(
      { role: 'user', content: 'Hello' },
    )
  }
  catch (error: any) {
    console.error('Error:', error.data || error.message)
    isLoading.value = false
  }
}

watch (data, (newData) => {
  if (newData && newData.length) {
    console.log('watch data')
    // this gets call a lot as part of ai-sdk/vue
    const lastData = newData[newData.length - 1]
    processData(lastData)
  }
})

function processData(data: any) {
  console.log('Data:', data)
}

async function processStream(stream: ReadableStream) {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = '' // buffer for incomplete JSON strings
  const receivedChunks: Array<{ timestamp: string, value: string }> = []

  while (true) {
    const { value, done } = await reader.read()

    if (done) {
      console.log('Stream complete. Received chunks:', receivedChunks)
      isLoading.value = false
      break
    }

    // Log when we receive a chunk
    receivedChunks.push({
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      }),
      value,
    })
    console.log(`Received chunk at ${receivedChunks[receivedChunks.length - 1].timestamp}:`, value)

    // add new chunk to buffer
    buffer += value
    // split buffer by newline for each message
    const lines = buffer.split('\n')
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.trim()) { // skip empty line
        try {
          const message = JSON.parse(line) as ResearchEvent
          task.value = steps.indexOf(message.event)
          console.log('Message:', message)
        }
        catch (error: any) {
          console.error('Error:', error.data || error.message)
        }
      }
    }
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
      <UProgress
        size="lg"
        :value="task"
        :max="steps"
        indicator
        class="mt-4"
      >
        <template #step-0="{ step }">
          <span class="text-primary">
            {{ step }}
          </span>
        </template>
      </UProgress>
    </div>
  </UCard>
</template>
