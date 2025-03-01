<template>
  <div
    class="relative flex h-full min-h-dvh w-full items-center justify-center bg-dark-50 dark:bg-dark-950"
  >
    <div class="relative z-20 w-11/12 md:w-10/12">
      <div class="flex flex-col items-center justify-center">
        <h1
          v-motion
          :initial="{ opacity: 0, filter: 'blur(10px)' }"
          :enter="{ opacity: 1, filter: 'blur(0px)' }"
          :delay="100"
          :duration="1250"
          class="mt-8 text-center text-5xl font-semibold text-dark-900 sm:text-6xl md:text-7xl dark:text-dark-100"
        >
          Company Researcher
        </h1>
        <p
          class="text-primary-950/60 dark:text-primary-50/50 mt-4 w-full text-center text-lg leading-8 sm:w-1/2 2xl:w-1/3 2xl:text-xl"
        >
          An AI agent that scans the web for details about a company provided by the user
        </p>
        <div
          class="mt-8 flex flex-col-reverse items-center justify-center gap-4 lg:flex-row"
        >
          <UButton variant="ghost" to="#" size="lg">
            More info
          </UButton>
          <UButton variant="solid" to="/research" size="lg">
            Research
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
