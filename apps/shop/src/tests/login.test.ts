import { expect, test } from '@playwright/test';

test.describe('인증 테스트', () => {
  test('로그인된 사용자는 /login 페이지에 접근할 수 없고 /로 리디렉션된다.', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/login');

    await page.waitForURL('http://localhost:3000/');

    await expect(page).toHaveURL('http://localhost:3000');
    await expect(page.getByText('LOGOUT')).toBeVisible();
  });
});
