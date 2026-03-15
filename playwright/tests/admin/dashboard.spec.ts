import { expect, test } from '@playwright/test';
import { DashboardPage } from '../../pages/AdminPage';

/**
 * 회귀 테스트: Fix 4 - 대시보드 상품 통계
 *
 * 버그: "상품 통계" 섹션이 표시되지 않거나, 판매 중/품절 수치가 항상 0으로 표시됨
 * 수정: Dashboard.tsx - useProductStatusQuery 훅 연결 및 productStatistics 렌더링 추가
 */
test.describe('대시보드 상품 통계', { tag: '@dashboard' }, () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    await dashboardPage.waitForPageReady();
  });

  // Happy Path
  test('"상품 통계" 섹션이 대시보드에 표시된다', async () => {
    await expect(dashboardPage.productStatisticsSection).toBeVisible();
  });

  test('"판매 중 상품" 레이블이 표시된다', async () => {
    await expect(dashboardPage.sellingProductLabel).toBeVisible();
  });

  test('"품절 상품" 레이블이 표시된다', async () => {
    await expect(dashboardPage.soldoutProductLabel).toBeVisible();
  });

  test('"판매 중 상품" 수치가 실제 데이터로 표시된다 (0보다 큰 값)', async ({ page }) => {
    // 판매 중 상품 수치 확인 — 실제 DB 데이터 기반이므로 0보다 커야 함
    const sellingSection = page.locator('div').filter({ hasText: /^판매 중 상품/ }).first();
    const valueLocator = sellingSection.locator('p').last();

    await expect(valueLocator).toBeVisible();

    const valueText = await valueLocator.textContent();
    const numericValue = parseInt((valueText ?? '0').replace(/[^0-9]/g, ''), 10);
    expect(numericValue).toBeGreaterThan(0);
  });

  test('"품절 상품" 수치가 숫자로 표시된다', async ({ page }) => {
    const soldoutSection = page.locator('div').filter({ hasText: /^품절 상품/ }).first();
    const valueLocator = soldoutSection.locator('p').last();

    await expect(valueLocator).toBeVisible();

    const valueText = await valueLocator.textContent();
    // 숫자 형태인지 확인 (0 이상)
    const numericValue = parseInt((valueText ?? '').replace(/[^0-9]/g, ''), 10);
    expect(numericValue).toBeGreaterThanOrEqual(0);
  });

  // Edge Cases
  test('대시보드에 "최근 주문 내역" 카드도 함께 표시된다', async ({ page }) => {
    await expect(page.getByText('최근 주문 내역')).toBeVisible();
  });

  test('대시보드에 "최근 등록 상품" 카드도 함께 표시된다', async ({ page }) => {
    await expect(page.getByText('최근 등록 상품')).toBeVisible();
  });

  // Error Cases
  test('대시보드 페이지가 에러 없이 로딩된다', async ({ page }) => {
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(page.getByText('오류가 발생했습니다')).not.toBeVisible();
  });

  test('상품 통계 수치가 로딩 후 실제 값으로 교체된다 (0으로 고정되지 않음)', async ({ page }) => {
    // 네트워크 요청 완료 후 실제 데이터가 반영되어야 함
    await page.waitForLoadState('networkidle');

    const sellingSection = page.locator('div').filter({ hasText: /^판매 중 상품/ }).first();
    const valueLocator = sellingSection.locator('p').last();
    const valueText = await valueLocator.textContent();
    const numericValue = parseInt((valueText ?? '0').replace(/[^0-9]/g, ''), 10);

    // 실제 데이터가 로드된 상태이므로 0이 아니어야 함
    expect(numericValue).toBeGreaterThan(0);
  });
});
