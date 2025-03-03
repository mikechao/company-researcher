<script setup lang="ts">
import SwitchColors from './SwitchColors.vue'
</script>

<template>
  <header
    class="flex items-center justify-between fixed left-0 top-0 z-50 px-4 w-full bg-dark-200/70 dark:bg-dark-900/70 backdrop-blur-md py-4 h-16"
    style="--header-height: 64px"
  >
    <div class="flex size-8 items-center justify-center">
      <NuxtLink to="/">
        <AppLogo />
      </NuxtLink>
    </div>
    <nav class="hidden center-center w-full flex-1 items-center justify-center gap-2 lg:flex">
      <UButton variant="ghost" color="neutral" size="lg" to="/">
        Home
      </UButton>

      <UButton variant="ghost" color="neutral" size="lg" to="/research">
        Research
      </UButton>
    </nav>
    <div class="flex flex-1 items-center justify-end gap-1 lg:flex-none">
      <SwitchColors />
      <ColorModeButton />
      <USlideover title="Menu" close-icon="i-mdi-alpha-x">
        <div class="inline-block md:hidden">
          <UButton icon="i-mdi-menu" variant="link" color="primary" size="lg" />
        </div>
        <template #body>
          <nav class="flex w-full flex-col">
            <UButton block variant="link" color="primary" size="lg" to="#">
              Home
            </UButton>
            <UButton block variant="link" color="primary" size="lg" to="#">
              Research
            </UButton>
          </nav>
        </template>
      </USlideover>
    </div>
  </header>
</template>
