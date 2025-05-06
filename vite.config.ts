import { defineConfig } from 'vite'
import pkg from './package.json'

const deps = Object.keys(pkg.dependencies ?? {})

export default defineConfig({
  build: {
    lib: {
      entry: 'src/cli.ts',
      formats: ['es'],
    },
    target: 'node20',
    rollupOptions: {
      external: [
        /^node:.+/,
        ...deps,
      ],
    },
  },
  ssr: {
    noExternal: true,
  },
})
