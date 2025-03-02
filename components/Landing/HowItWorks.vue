<template>
  <div class="bg-dark-50 dark:bg-dark-950 relative h-auto w-full">
    <div
      class="2xl:max-w-screen-2xl mx-auto grid h-full min-h-dvh w-full grid-cols-2 items-center justify-center gap-4 px-4"
    >
      <div class="relative col-span-full mt-28 lg:col-span-1">
        <div class="flex flex-col items-center justify-center lg:items-start">
          <h1
            class="text-dark-900 dark:text-dark-100 w-full text-center font-sans text-4xl leading-10 font-bold sm:text-5xl md:w-10/12 lg:w-full lg:text-left lg:text-6xl"
          >
            How it works
          </h1>
          <p
            class="text-primary-950/60 dark:text-primary-50/50 mt-4 w-full text-center text-lg leading-8 md:w-1/2 lg:w-3/5 lg:text-left 2xl:text-xl"
          >
            Unlock your construction project's full potential with our
            comprehensive suite of tools and services
          </p>
        </div>
      </div>
      <div class="relative col-span-full mt-4 lg:col-span-1">
        <NuxtImg
          class="max-h-[420px] w-full rounded-lg object-contain object-center lg:max-h-[720px]"
          src="/graph.png"
          loading="lazy"
          alt="langgraph-node-graph"
        />
      </div>
    </div>
  </div>
</template>
