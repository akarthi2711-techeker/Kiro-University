import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base must match the GitHub repository name so that all asset paths
  // (JS bundles, CSS, favicon) resolve correctly under GitHub Pages.
  // GitHub Pages serves this project at:  https://<user>.github.io/Kiro-University/
  base: '/Kiro-University/',

  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
