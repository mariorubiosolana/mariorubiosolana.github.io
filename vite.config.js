import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Render the shared footer in every page, including future HTML entries.
const footerPath = new URL('./src/site-footer.html', import.meta.url)

export default defineConfig({
  plugins: [{
    name: 'portfolio-global-footer',
    transformIndexHtml(html) {
      const footer = readFileSync(footerPath, 'utf8')
      return html.replace(/<\/body>/i, `${footer}\n  </body>`)
    },
  }],
  server: {
    watch: {
      ignored: ['**/.layout-check/**']
    }
  },

  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        objects: fileURLToPath(new URL('./objects.html', import.meta.url)),
        woodenVoid: fileURLToPath(new URL('./objects/wooden-void.html', import.meta.url)),
        foldedVoid: fileURLToPath(new URL('./objects/folded-void.html', import.meta.url)),
        info: fileURLToPath(new URL('./info.html', import.meta.url)),
        theLine: fileURLToPath(new URL('./projects/the-line.html', import.meta.url)),
        houseInTheClearing: fileURLToPath(new URL('./projects/house-in-the-clearing.html', import.meta.url)),
        catedral: fileURLToPath(new URL('./projects/catedral.html', import.meta.url)),
        villaverde: fileURLToPath(new URL('./projects/villaverde.html', import.meta.url)),
      },
    },
  },
})
