import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 7000,
    strictPort: true,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
  },
})
