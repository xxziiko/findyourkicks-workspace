import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
  test('로그인을 성공하면 대시보드로 리디렉션된다.', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('이메일').fill('admin@example.com');
    await page.getByLabel('비밀번호').fill('admin123');

    await page.getByRole('button', { name: '로그인' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/');
    await expect(page.getByText(/반갑습니다/)).toBeVisible();
  });

  test('이메일 또는 비밀번호가 일치하지 않으면 에러 메시지가 표시된다.', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('이메일').fill('wrong@example.com');
    await page.getByLabel('비밀번호').fill('wrongpass');

    await page.getByRole('button', { name: '로그인' }).click();

    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();
  });
});
