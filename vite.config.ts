import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
// `base` is set to the repo name for GitHub Pages production builds so asset
// URLs resolve under https://<user>.github.io/ai-career-navigator-v2/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ai-career-navigator-v2/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
