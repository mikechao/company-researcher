export default defineAppConfig({
  ui: {
    header: {
      wrapper: 'lg:!border-transparent bg-gray-50/10 dark:bg-gray-950/[0.06]',
      links: {
        wrapper: 'ring-1 ring-primary-200 dark:ring-primary-800 px-3 gap-x-0 rounded-full',
        base: 'py-2 px-4 font-medium transition-colors relative after:absolute after:-bottom-px after:inset-x-2 after:h-px after:rounded-full after:opacity-0 after:bg-gray-900 dark:after:bg-white after:transition-opacity',
        active: 'text-gray-900 dark:text-white after:opacity-100',
        inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
      },
    },
    icons: {
      dark: 'i-mdi-weather-night',
      light: 'i-mdi-weather-sunny',
    },
  },
})
