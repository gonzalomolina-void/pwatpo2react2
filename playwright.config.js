/* global process */
import { defineConfig, devices } from '@playwright/test';

/**
 * Ver documentación en https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Ejecutar tests en archivos en paralelo */
  fullyParallel: true,
  /* Fallar el build en CI si olvidaste test.only en el código */
  forbidOnly: !!process.env.CI,
  /* Reintentar solo en CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt-out de tests paralelos en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter a usar. Ver https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configuración compartida para todos los proyectos abajo. Ver https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Recolectar traza cuando se reintenta un test fallido. Ver https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Capturar screenshot en caso de falla */
    screenshot: 'only-on-failure',

    /* Grabar video y ralentizar si estamos en modo DEMO o si especificamos SLOWMO */
    video: (process.env.DEMO || process.env.SLOWMO) ? 'on' : 'off',
    launchOptions: {
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : (process.env.DEMO ? 1500 : 0),
    },
  },

  /* Configurar proyectos para los navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Ejecutar tu servidor local antes de empezar los tests */
  webServer: {
    command: 'npm.cmd run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
