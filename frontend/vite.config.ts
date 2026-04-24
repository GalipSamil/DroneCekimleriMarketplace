import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    drop: mode === 'production' || mode === 'docker' ? ['console', 'debugger'] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@microsoft/signalr')) {
            return 'signalr'
          }

          if (
            id.includes('react') ||
            id.includes('scheduler') ||
            id.includes('react-router')
          ) {
            return 'react-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
}))
