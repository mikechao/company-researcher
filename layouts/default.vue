<template>
  <div class="relative w-full min-h-dvh h-full bg-dark-50 dark:bg-dark-950">
    <AppHeader />
    <UContainer class="max-w-[1680px]" style="padding-top: var(--header-height, 64px);">
      <slot />
    </UContainer>
    <AppFooter />
  </div>
</template>
