<template>
  <header
    class="fixed left-0 top-0 z-20 flex w-full items-center justify-between px-4 py-2"
  >
    <div class="size-8">
      <NuxtLink to="/" class="flex items-center">
        <img
          src="/logo-dark.svg"
          alt="Company Researcher Logo"
          class="h-8 w-auto dark:hidden"
        >
        <img
          src="/logo-light.svg"
          alt="Company Researcher Logo"
          class="h-8 w-auto hidden dark:block"
        >
      </NuxtLink>
    </div>
    <div
      class="border-dark-200/60 bg-dark-50/30 dark:border-dark-500/5 dark:bg-dark-900/90 hidden items-center justify-center rounded-full border px-24 py-1 backdrop-blur md:flex"
    >
      <nav class="flex w-full items-center justify-center gap-2">
        <UButton
          variant="ghost"
          color="primary"
          size="lg"
          to="/"
          class="rounded-full px-4"
        >
          Home
        </UButton>
        <UButton
          variant="ghost"
          color="primary"
          size="lg"
          to="/research"
          class="rounded-full px-4"
        >
          Research
        </UButton>
      </nav>
    </div>
    <div class="flex w-auto gap-4">
      <ColorModeButton />
      <USlideover title="Menu" close-icon="i-mdi-alpha-x">
        <div class="inline-block md:hidden">
          <UButton
            icon="i-mdi-menu"
            variant="link"
            color="primary"
            size="lg"
          />
        </div>
        <template #body>
          <nav class="flex w-full flex-col gap-2">
            <UButton
              variant="ghost"
              color="primary"
              size="lg"
              to="/"
              class="rounded-full px-4"
            >
              Home
            </UButton>
            <UButton
              variant="ghost"
              color="primary"
              size="lg"
              to="/research"
              class="rounded-full px-4"
            >
              Research
            </UButton>
          </nav>
        </template>
      </USlideover>
    </div>
  </header>
</template>
