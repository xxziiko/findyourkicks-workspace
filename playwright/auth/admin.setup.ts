import { expect, test as setup } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../.auth/admin.json');

/**
 * Admin 로그인 Setup
 *
 * 이 setup은 모든 admin 테스트 실행 전 한 번만 수행됩니다.
 * 저장된 storageState를 재사용하여 매 테스트마다 로그인하지 않습니다.
 */
setup('admin 로그인 상태 저장', async ({ page }) => {
  await page.goto('/login');
  await page.waitForURL('**/login');

  await page.getByLabel('이메일').fill('admin@example.com');
  await page.getByLabel('비밀번호').fill('admin123');
  await page.getByRole('button', { name: '로그인' }).click();

  // 로그인 성공 후 대시보드로 이동 확인
  await page.waitForURL('/');

  // storageState 저장
  await page.context().storageState({ path: AUTH_FILE });
});
