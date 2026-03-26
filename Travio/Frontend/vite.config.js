import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'nonevolutional-dovie-unneighborly.ngrok-free.dev'
    ]
  }
})
