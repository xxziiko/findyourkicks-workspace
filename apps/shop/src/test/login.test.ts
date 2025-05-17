import { expect, test } from '@playwright/test';
import { test as authTest } from './login.setup';

test.describe('Login page', () => {
  test('카카오 로그인 버튼을 누르면 카카오 로그인으로 리디렉션된다.', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/login');

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
    await page.goto('http://localhost:3000/login');

    await expect(page.getByText(/구글계정으로 로그인/)).toBeVisible();
    await page.getByRole('button', { name: '구글계정으로 로그인' }).click();

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('https://accounts.google.com/');
  });

  authTest(
    '로그인 성공시 메인페이지로 리디렉션된다.',
    async ({ authContext }) => {
      const page = await authContext.newPage();
      await page.goto('http://localhost:3000');

      await page.waitForURL('http://localhost:3000/');
      await expect(page).toHaveURL('http://localhost:3000');
      await expect(page.getByText(/언제 어디서나 함께/)).toBeVisible();
    },
  );

  //FIXME:
  authTest(
    '로그인된 사용자는 /login 페이지에 접근할 수 없고 /로 리디렉션된다.',
    async ({ authContext }) => {
      const page = await authContext.newPage();
      await page.goto('http://localhost:3000/login');

      await page.waitForURL('http://localhost:3000/');

      await expect(page).toHaveURL('http://localhost:3000');
      await expect(page.getByText(/언제 어디서나 함께/)).toBeVisible();
    },
  );
});
