<script setup lang="ts">
const colorMode = useColorMode()

interface ColorModeLabel {
  label: string
  icon: string
}

const darkMode: ColorModeLabel = {
  label: 'Dark',
  icon: 'i-mdi-weather-night',
}

const lightMode: ColorModeLabel = {
  label: 'Light',
  icon: 'i-mdi-weather-sunny',
}

const selectedMode = computed<ColorModeLabel>(() =>
  colorMode.value === 'dark' ? darkMode : lightMode,
)

function changeColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UButton
    :label="selectedMode.label"
    color="gray"
    variant="ghost"
    :icon="selectedMode.icon"
    @click="changeColorMode"
  />
</template>
