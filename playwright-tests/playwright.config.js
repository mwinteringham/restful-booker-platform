const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:3003';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 2,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results.json' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Logs in once as admin and saves the session for the admin tests
    { name: 'setup', testMatch: /auth\.setup\.js/ },
    {
      name: 'guest',
      testMatch: /(guest|auth|api)\/.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin',
      testMatch: /admin\/.*\.spec\.js/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: '.auth/admin.json' },
    },
  ],
});
