import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const URLS = {
  HOME: '/',
  CART: '/cart',
} as const;

export const BUTTON_TEXT = {
  ADD_TO_CART: '장바구니',
  DELETE: '삭제하기',
  ORDER: '주문하기',
  INCREASE: '+',
  DECREASE: '-',
} as const;

export const TEXT = {
  QUANTITY: '수량',
  EMPTY_CART: '장바구니가 비어있어요!',
} as const;

export const REGEX = {
  PRODUCT_URL: /\/product\/\d+/,
  SIZE_BUTTON: /^\d{3}$/,
} as const;

export async function navigateToHomePage(page: Page) {
  await page.goto(URLS.HOME);
  await page.waitForLoadState('networkidle');

  // 상품이 로드될 때까지 기다림 (이미지 로드 실패 시에도 작동하도록)
  const firstProduct = page
    .getByRole('link')
    .filter({ has: page.getByRole('button') })
    .first();

  // 상품이 DOM에 나타날 때까지 기다림
  await firstProduct.waitFor({ state: 'attached', timeout: 15000 });
  await expect(firstProduct).toBeVisible({ timeout: 10000 });
}

export async function selectFirstProduct(page: Page) {
  const firstProduct = page
    .getByRole('link')
    .filter({ has: page.getByRole('button') })
    .first();

  // 상품이 클릭 가능한 상태가 될 때까지 기다림
  await firstProduct.waitFor({ state: 'attached', timeout: 10000 });
  await expect(firstProduct).toBeVisible();

  // 네비게이션을 기다리면서 클릭
  await Promise.all([
    page.waitForURL(REGEX.PRODUCT_URL, { timeout: 10000 }),
    firstProduct.click(),
  ]);

  await page.waitForLoadState('networkidle');
}

export async function selectFirstAvailableSize(page: Page) {
  const firstAvailableSize = page
    .locator('button')
    .filter({ hasText: REGEX.SIZE_BUTTON })
    .first();
  await firstAvailableSize.click();
}

export async function addToCartWithApiWait(page: Page) {
  const addToCartButton = page
    .locator('button')
    .filter({ hasText: BUTTON_TEXT.ADD_TO_CART })
    .first();

  await expect(addToCartButton).toBeVisible();

  const addToCartPromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/cart') &&
      response.request().method() === 'POST',
  );

  await addToCartButton.click();
  await addToCartPromise;
  await page.waitForLoadState('networkidle');
}

export async function navigateToCartPage(page: Page) {
  await page.goto(URLS.CART);
  await page.waitForLoadState('networkidle');
}

export async function addProductToCart(page: Page) {
  await navigateToHomePage(page);
  await selectFirstProduct(page);
  await selectFirstAvailableSize(page);
  await addToCartWithApiWait(page);
}

export async function createOrderSheet(page: Page) {
  const orderButton = page
    .getByRole('button', { name: BUTTON_TEXT.ORDER })
    .last();
  await expect(orderButton).toBeVisible();
  await expect(orderButton).toBeEnabled();
  await orderButton.click();
  await page.waitForLoadState('networkidle');
}

// 장바구니 초기화 (테스트 격리용)
export async function clearCart(page: Page) {
  await page.goto(URLS.CART);
  await page.waitForLoadState('networkidle');

  // 빈 장바구니 메시지가 보이면 이미 비어있음
  const emptyCartText = page.locator(`text=${TEXT.EMPTY_CART}`);
  const isEmpty = await emptyCartText.isVisible().catch(() => false);
  if (isEmpty) {
    return;
  }

  // 삭제 버튼이 있는지 확인
  const deleteButtons = page
    .locator('button')
    .filter({ hasText: BUTTON_TEXT.DELETE });
  const count = await deleteButtons.count();

  // 모든 상품 삭제
  for (let i = 0; i < count; i++) {
    await deleteButtons.first().click();
    await page.waitForLoadState('networkidle');
  }
}
