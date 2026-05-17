import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
    env: {
      VITE_API_URL: 'http://localhost/api'
    }
  },

})
