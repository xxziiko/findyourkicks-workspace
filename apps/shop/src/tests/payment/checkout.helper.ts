import { type Page, expect } from '@playwright/test';
import { createOrderSheet, navigateToCartPage } from '../cart/cart.helpers';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

export async function navigateToCheckoutPage(page: Page) {
  await navigateToCartPage(page);
  await createOrderSheet(page);
  await page.waitForURL(/\/checkout\/[^/]+$/, { timeout: TEST_TIMEOUTS.LONG });
  return extractOrderIdFromUrl(page.url(), 'checkout');
}

// URL에서 orderId 추출
export function extractOrderIdFromUrl(
  url: string,
  path: 'checkout' | 'complete',
) {
  return url.split(`/${path}/`)[1];
}

// 약관 체크박스와 결제 버튼 가져오기
export function getCheckoutElements(page: Page) {
  const agreementCheckbox = page.getByRole('checkbox', {
    name: '주문 동의 및 개인정보 수집 이용 동의',
  });
  const paymentButton = page.getByRole('button', { name: '결제하기' });

  return { agreementCheckbox, paymentButton };
}

// 약관 동의 및 결제하기 버튼 클릭
export async function agreeAndPay(page: Page) {
  const { agreementCheckbox, paymentButton } = getCheckoutElements(page);

  await expect(agreementCheckbox).toBeVisible();
  await agreementCheckbox.check();

  await expect(paymentButton).toBeEnabled();
  await paymentButton.click();
}
