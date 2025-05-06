import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/cli.ts',
      formats: ['es'],
    },
  },
})
