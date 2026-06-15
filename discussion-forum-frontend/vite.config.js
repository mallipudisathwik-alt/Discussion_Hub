import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Discussion_Hub/',
  server: {
    port: 5173
  }
})