import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The backend has no CORS config, so the dev/preview server proxies /api to it.
const proxy = { '/api': process.env.API_TARGET ?? 'http://localhost:8080' }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, proxy },
  preview: { host: true, port: 5173, proxy },
})
