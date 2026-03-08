import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('리뷰 섹션', () => {
  test('상품 상세 페이지에 리뷰 섹션이 렌더링된다', async ({ page }) => {
    // 홈에서 첫 상품 클릭
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.waitFor({ state: 'visible' });
    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    // /product/[id] 페이지인지 확인
    await expect(page).toHaveURL(/\/product\//);

    // 리뷰 섹션 헤더 "리뷰" 텍스트 확인
    const reviewHeading = page.getByRole('heading', { name: '리뷰' });
    await reviewHeading.waitFor({ state: 'visible' });
    await expect(reviewHeading).toBeVisible();

    // 리뷰 없음 메시지 또는 리뷰 목록 중 하나가 표시되어야 함
    const hasReviews = await page
      .locator('[class*="ReviewCard"], [class*="reviewCard"]')
      .first()
      .isVisible()
      .catch(() => false);
    const isEmpty = await page
      .locator('text=아직 리뷰가 없습니다.')
      .isVisible()
      .catch(() => false);
    const isLoading = await page
      .locator('text=리뷰를 불러오는 중...')
      .isVisible()
      .catch(() => false);

    expect(hasReviews || isEmpty || isLoading).toBe(true);
  });

  test('비인증 상태에서 리뷰 작성 자격 확인 API가 canReview: false를 반환한다', async ({
    request,
  }) => {
    // 비인증 상태에서 eligibility API 직접 호출
    // 인증되지 않은 사용자는 NOT_PURCHASED 이유로 canReview: false를 받아야 함
    const response = await request.get(
      `${BASE_URL}/api/products/some-product-id/reviews/eligibility`,
    );

    // API는 항상 200 응답을 반환 (인증 여부와 무관하게 JSON 반환)
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('canReview');
    expect(body.canReview).toBe(false);
    expect(body).toHaveProperty('reason', 'NOT_PURCHASED');
  });

  test('비인증 상태에서는 리뷰 작성 버튼이 표시되지 않는다', async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.waitFor({ state: 'visible' });
    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/product\//);

    // eligibility 쿼리가 canReview: false를 반환하므로 "리뷰 작성" 버튼이 없어야 함
    const writeButton = page.getByRole('button', { name: '리뷰 작성' });
    await expect(writeButton).not.toBeVisible();
  });
});
