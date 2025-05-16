import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
