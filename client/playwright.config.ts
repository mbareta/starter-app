import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load.env.e2e;
dotenv.config({ path: path.resolve(__dirname, '.env.e2e') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 30000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    launchOptions: {
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        // Google-specific flags
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ]
    },
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { channel: 'chromium' },
      dependencies: ['setup']
    }
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'npm start --prefix ../server',
      url: 'http://localhost:3000/healthcheck',
      reuseExistingServer: !process.env.CI,
      // stdout: 'pipe',
      timeout: 10000
    }
  ]
});
