import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['mongoose']
  },
  server: {
    fs: {
      allow: ['.']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/products': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/cart': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/orders': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/wishlist': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      external: ['mongoose', 'express', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken', 'stripe']
    }
  }
})
