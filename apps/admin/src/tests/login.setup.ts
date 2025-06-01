import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test as setup } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../storageState.json');

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');

  await page.getByLabel('이메일').fill('admin@example.com');
  await page.getByLabel('비밀번호').fill('admin123');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('http://localhost:5173/');

  await page.context().storageState({
    path: authFile,
  });
});
