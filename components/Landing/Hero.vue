<template>
  <div
    class="relative flex h-full min-h-dvh w-full items-center justify-center bg-dark-50 dark:bg-dark-950"
  >
    <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <UIcon
        name="i-mdi-microscope"
        class="text-dark-900/[0.03] dark:text-dark-100/[0.04] text-[25rem] md:text-[35rem]"
      />
    </div>
    <div class="relative z-20 w-11/12 md:w-10/12">
      <div class="flex flex-col items-center justify-center">
        <h1
          v-motion
          :initial="{ opacity: 0, filter: 'blur(10px)' }"
          :enter="{ opacity: 1, filter: 'blur(0px)' }"
          :delay="100"
          :duration="625"
          class="mt-8 text-center text-5xl font-semibold text-dark-900 sm:text-6xl md:text-7xl dark:text-dark-100"
        >
          Company Researcher
        </h1>
        <p
          class="text-gray-700 dark:text-gray-200 mt-4 w-full text-center text-lg leading-8 sm:w-1/2 2xl:w-1/3 2xl:text-xl"
        >
          An AI agent that scans the web for details about a company provided by the user
        </p>
        <div
          class="mt-8 flex flex-col-reverse items-center justify-center gap-4 lg:flex-row"
        >
          <UButton
            variant="outline"
            to="#how-it-works"
            size="lg"
            label="How it works"
            icon="i-mdi-arrow-down"
            :trailing="true"
          />
          <UButton
            variant="solid"
            to="/research"
            size="lg"
            label="Research"
            icon="i-mdi-microscope"
            :trailing="true"
            color="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>
