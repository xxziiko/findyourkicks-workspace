import { defineConfig, devices } from '@playwright/test';

// 환경 변수에 따라 필요한 서버만 시작
const webServerTarget = process.env.PLAYWRIGHT_WEBSERVER;

const shopServer = {
  command: 'pnpm --filter shop dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
};

const adminServer = {
  command: 'pnpm --filter admin dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
};

const getWebServers = () => {
  if (webServerTarget === 'shop') return [shopServer];
  if (webServerTarget === 'admin') return [adminServer];
  return [shopServer, adminServer]; // 기본값: 둘 다 시작 (로컬 개발용)
};

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: '.',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: 'html',

  use: {
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },

  // Start dev server before running tests
  webServer: getWebServers(),

  // Configure projects for major browsers.
  projects: [
    {
      name: 'admin-setup',
      testMatch: ['apps/admin/src/tests/**/*.setup.ts'],
      use: {
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'admin',
      testMatch: ['apps/admin/src/tests/**/*.test.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'apps/admin/storageState.json',
        baseURL: 'http://localhost:5173',
      },
      dependencies: ['admin-setup'],
    },
    {
      name: 'shop-setup',
      testMatch: ['apps/shop/src/tests/login.setup.ts'],
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'shop-payment-setup',
      testMatch: ['apps/shop/src/tests/payment/payment.setup.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'apps/shop/storageState.json',
        baseURL: 'http://localhost:3000',
      },
      dependencies: ['shop-setup'],
    },
    {
      name: 'shop',
      testMatch: ['apps/shop/src/tests/**/*.test.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'apps/shop/storageState.json',
        baseURL: 'http://localhost:3000',
      },
      dependencies: ['shop-setup'],
    },
    {
      name: 'shop-payment',
      testMatch: ['apps/shop/src/tests/payment/*.test.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'apps/shop/paymentStorageState.json',
        baseURL: 'http://localhost:3000',
      },
      dependencies: ['shop-payment-setup'],
    },

    {
      name: 'shop-public',
      testMatch: ['apps/shop/src/tests/login.public.test.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'apps/shop/storageState.json',
        baseURL: 'http://localhost:3000',
      },
    },
  ],
});
