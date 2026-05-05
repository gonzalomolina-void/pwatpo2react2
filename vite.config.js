import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import pkg from './package.json'

// Obtener el hash corto del commit actual
const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
  build: {
    esbuild: {
      banner: `/*! HEXA TCG - v${pkg.version} - Commit: ${commitHash} - Build: ${new Date().toISOString()} */`,
    },
  },
})
