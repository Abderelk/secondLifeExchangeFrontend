import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'SecondLife Exchange',
        short_name: 'SLE',
        theme_color: '#ffffff'
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // ← Doit correspondre au port du backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})