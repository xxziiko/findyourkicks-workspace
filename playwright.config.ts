import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * Admin 앱 (http://localhost:5173) 대상 회귀 테스트
 */
export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Auth setup: 로그인 상태를 한 번만 저장
    {
      name: 'setup',
      testDir: './playwright/auth',
      testMatch: /admin\.setup\.ts/,
    },

    // Admin 테스트: 저장된 로그인 상태 재사용
    {
      name: 'admin',
      testDir: './playwright/tests/admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],

  // 테스트 실행 전 Admin dev 서버 자동 시작
  webServer: {
    command: 'pnpm dev:admin',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
