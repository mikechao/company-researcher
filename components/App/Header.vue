<script setup lang="ts">
const slideOverOpen = ref(false)
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
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        to="/"
        label="Home"
        active-class="border-b-2 border-primary-500 rounded-none"
      />
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        to="/research"
        label="Research"
        active-class="border-b-2 border-primary-500 rounded-none"
      />
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        to="/complex"
        label="Complex"
        active-class="border-b-2 border-primary-500 rounded-none"
      />
    </nav>
    <div class="flex flex-1 items-center justify-end gap-0 lg:flex-none">
      <UButton
        to="https://github.com/mikechao/company-researcher" target="_blank" icon="i-mdi-github" variant="link"
        color="primary" size="lg" aria-label="GitHub Repository"
      />
      <AppSwitchColors />
      <AppColorModeButton />
      <UButton
        class="inline-block md:hidden"
        icon="i-mdi-menu"
        variant="link"
        color="primary"
        size="lg"
        aria-label="Mobile Menu Button"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-haspopup="false"
        @click="slideOverOpen = !slideOverOpen"
      />
      <USlideover v-model:open="slideOverOpen" title="Menu" close-icon="i-mdi-window-close">
        <template #body>
          <nav id="mobile-menu" class="flex w-full flex-col" role="navigation" aria-label="Mobile navigation">
            <UButton
              block
              variant="link"
              color="primary"
              size="lg"
              to="/"
              label="Home"
              @click="slideOverOpen = false"
            />
            <UButton
              block
              variant="link"
              color="primary"
              size="lg"
              to="/research"
              label="Research"
              @click="slideOverOpen = false"
            />
            <UButton
              block
              variant="link"
              color="primary"
              size="lg"
              to="/complex"
              label="Complex"
              @click="slideOverOpen = false"
            />
          </nav>
        </template>
      </USlideover>
    </div>
  </header>
</template>
