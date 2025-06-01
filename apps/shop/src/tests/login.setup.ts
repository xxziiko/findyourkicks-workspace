import { expect, test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.getByRole('button', { name: '테스트 계정으로 로그인' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('http://localhost:3000');
  await expect(page.getByText('LOGOUT')).toBeVisible();

  await page.context().storageState({ path: 'apps/shop/storageState.json' });
});
