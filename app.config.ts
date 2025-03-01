export default defineAppConfig({
  ui: {
    icons: {
      chevronDown: 'i-mdi-chevron-down-box-outline',
    },
    button: {
      slots: {
        base: 'rounded-full',
      },
    },
    modal: {
      slots: {
        footer: 'flex justify-end gap-2',
      },
    },
  },
})
