import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.layout-check/**']
    }
  },

  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        theLine: fileURLToPath(new URL('./projects/the-line.html', import.meta.url)),
        houseInTheClearing: fileURLToPath(new URL('./projects/house-in-the-clearing.html', import.meta.url)),
        catedral: fileURLToPath(new URL('./projects/catedral.html', import.meta.url)),
        villaverde: fileURLToPath(new URL('./projects/villaverde.html', import.meta.url)),
      },
    },
  },
})