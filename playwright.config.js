const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/playwright/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000'
  },
  webServer: {
    command: 'npm start',
    port: 3000,
    // E2E=1 turns on the test-only login (Google blocks bots) and skips the 2.4 s animation.
    env: {
      E2E: '1',
      PORT: '3000',
      SESSION_SECRET: 'e2e-secret',
      GOOGLE_CLIENT_ID: '',
      GOOGLE_CLIENT_SECRET: '',
      HOROSCOPE_API_URL: ''
    },
    // Always start our own server so a running dev server without E2E=1 cannot break the tests.
    reuseExistingServer: false
  }
});
