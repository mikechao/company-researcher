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

const links = computed(() => [
  [{
    label: 'Research',
    icon: 'i-mdi-microscope',
    to: '/',
  }],
  [{
    label: selectedMode.value.label,
    icon: selectedMode.value.icon,
    click: changeColorMode,

  }],
])
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
    <slot />
  </div>
</template>
