import { expect, test } from '@playwright/test';

test.describe('리다이렉션 테스트', () => {
  test('카카오 로그인 버튼을 누르면 카카오 로그인으로 리디렉션된다.', async ({
    page,
  }) => {
    await page.goto('/login');

    await expect(page.getByText(/카카오계정으로 로그인/)).toBeVisible();
    await page.getByRole('button', { name: '카카오계정으로 로그인' }).click();

    await page.waitForURL(/kakao\.com\/login/);
    expect(page.url()).toContain('https://accounts.kakao.com');

    const kakaoText = page.locator('text=Kakao').first();
    await expect(kakaoText).toBeVisible();
  });

  test('구글 로그인 버튼을 누르면 구글 로그인으로 리디렉션된다.', async ({
    page,
  }) => {
    await page.goto('/login');

    await expect(page.getByText(/구글계정으로 로그인/)).toBeVisible();

    await page.getByRole('button', { name: '구글계정으로 로그인' }).click();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('https://accounts.google.com/');
  });

  test('로그인 성공시 메인페이지로 리디렉션된다.', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '테스트 계정으로 로그인' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/');
    await expect(page.getByText('LOGOUT')).toBeVisible();
  });
});
