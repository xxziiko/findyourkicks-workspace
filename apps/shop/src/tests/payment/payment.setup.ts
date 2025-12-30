import { expect, test as setup } from '@playwright/test';
import {
  addProductToCart,
  createOrderSheet,
  navigateToCartPage,
} from '../cart/cart.helpers';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * 결제 테스트를 위한 Setup
 * - 장바구니에 상품 추가
 * - 주문서 생성 (장바구니 → 결제 페이지 이동)
 * - 결제 페이지에서 대기
 */
setup('prepare checkout page for payment', async ({ page }) => {
  await addProductToCart(page);
  await navigateToCartPage(page);
  await createOrderSheet(page);

  // 결제 페이지 도착 대기
  await page.waitForURL(/\/checkout\//, { timeout: TEST_TIMEOUTS.LONG });
  await expect(
    page
      .getByRole('heading', { level: 4, name: /배송 정보|결제 정보/ })
      .first(),
  ).toBeVisible();

  // 결제 페이지 상태를 저장
  await page.context().storageState({
    path: 'apps/shop/paymentStorageState.json',
  });
});
