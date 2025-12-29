import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const URLS = {
  HOME: 'http://localhost:3000',
  CART: 'http://localhost:3000/cart',
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

  const firstProduct = page
    .getByRole('link')
    .filter({ has: page.getByRole('button') })
    .first();
  await expect(firstProduct).toBeVisible({ timeout: 10000 });
}

export async function selectFirstProduct(page: Page) {
  const firstProduct = page
    .getByRole('link')
    .filter({ has: page.getByRole('button') })
    .first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(REGEX.PRODUCT_URL);
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
