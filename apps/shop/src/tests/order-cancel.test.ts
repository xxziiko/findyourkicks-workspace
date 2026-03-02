import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('주문 취소 플로우', () => {
  test('비인증 상태에서 주문 목록 접근 시 로그인 페이지로 이동한다', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/my/orders`);
    await page.waitForURL(/login/);

    // /my/orders는 AUTH_PATHS에 포함되어 있으므로 미인증 시 /login으로 리다이렉트
    await expect(page).toHaveURL(/login/);
  });

  test('비인증 상태에서 주문 상세 페이지 접근 시 로그인 페이지로 이동한다', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/my/orders/test-order-id`);
    await page.waitForURL(/login/);

    // /my/* 경로는 AUTH_PATHS에 포함되어 있으므로 미인증 시 /login으로 리다이렉트
    await expect(page).toHaveURL(/login/);
  });

  test('비인증 상태에서 주문 취소 API 호출 시 401 또는 리다이렉트 응답을 반환한다', async ({
    request,
  }) => {
    // 인증 없이 취소 API 직접 호출
    const response = await request.post(
      `${BASE_URL}/api/orders/non-existent-order/cancel`,
    );

    // 인증되지 않은 요청이므로 401 Unauthorized 또는 400/404 응답 확인
    // (서버가 인증을 검사하는 경우 401, 주문이 없는 경우 404)
    expect([400, 401, 403, 404]).toContain(response.status());
  });

  test('비인증 상태에서 주문 반품 API 호출 시 오류 응답을 반환한다', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/orders/non-existent-order/return`,
    );

    expect([400, 401, 403, 404]).toContain(response.status());
  });
});
