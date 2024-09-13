import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  webServer: [{
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }, {
    command: 'npm start --prefix ../server',
    url: 'http://localhost:3000/healthcheck',
    reuseExistingServer: !process.env.CI,
    // stdout: 'pipe',
    timeout: 10000
  }]
});
