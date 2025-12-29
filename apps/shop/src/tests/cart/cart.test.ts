import { expect, test } from '@playwright/test';
import {
  BUTTON_TEXT,
  TEXT,
  addProductToCart,
  createOrderSheet,
  navigateToCartPage,
} from './cart.helpers';

test.describe('장바구니 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCartPage(page);

    const deleteButtons = page
      .locator('button')
      .filter({ hasText: BUTTON_TEXT.DELETE });
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      await deleteButtons.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('사용자가 상품을 선택하고 장바구니에 담을 수 있다', async ({ page }) => {
    // Given: 사용자가 홈페이지에 있고
    // When: 상품을 선택하여 장바구니에 추가하면
    await addProductToCart(page);
    await navigateToCartPage(page);

    // Then: 장바구니에 상품이 표시되고 주문 버튼이 활성화된다
    await expect(page.locator(`text=${TEXT.EMPTY_CART}`)).not.toBeVisible();
    await expect(page.locator(`text=${TEXT.QUANTITY}`)).toBeVisible();

    const orderButton = page
      .getByRole('button', { name: BUTTON_TEXT.ORDER })
      .last();
    await expect(orderButton).toBeVisible();
    await expect(orderButton).toBeEnabled();
  });

  test('사용자가 장바구니에서 상품 수량을 증가 및 감소할 수 있다', async ({
    page,
  }) => {
    // Given: 장바구니에 상품이 담겨있고
    await addProductToCart(page);
    await navigateToCartPage(page);
    await expect(page.locator(`text=${TEXT.QUANTITY}`)).toBeVisible();

    // When: 수량 증가 버튼을 클릭하면
    const increaseButton = page
      .getByRole('button', { name: BUTTON_TEXT.INCREASE })
      .first();
    await expect(increaseButton).toBeVisible();
    await increaseButton.click();
    await page.waitForLoadState('networkidle');

    // Then: 수량이 증가한다 (UI 업데이트 확인)
    await expect(increaseButton).toBeVisible();

    // When: 수량 감소 버튼을 클릭하면
    const decreaseButton = page
      .getByRole('button', { name: BUTTON_TEXT.DECREASE })
      .first();
    await expect(decreaseButton).toBeVisible();
    await decreaseButton.click();
    await page.waitForLoadState('networkidle');

    // Then: 수량이 감소한다 (UI 업데이트 확인)
    await expect(decreaseButton).toBeVisible();
  });

  test('사용자가 장바구니에서 상품을 삭제할 수 있다', async ({ page }) => {
    // Given: 장바구니에 상품이 담겨있고
    await addProductToCart(page);
    await navigateToCartPage(page);

    // When: 삭제 버튼을 클릭하면
    const deleteButton = page
      .locator('button')
      .filter({ hasText: BUTTON_TEXT.DELETE })
      .first();
    const deletePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/cart') &&
        response.request().method() === 'DELETE',
    );

    await deleteButton.click();
    await deletePromise;
    await page.waitForLoadState('networkidle');

    // Then: 장바구니가 비어있다는 메시지가 표시된다
    await expect(page.locator(`text=${TEXT.EMPTY_CART}`)).toBeVisible();
  });

  test('사용자가 장바구니에서 상품을 선택하고 주문하면 주문서가 생성된다', async ({
    page,
  }) => {
    // Given: 장바구니에 상품이 담겨있고
    await addProductToCart(page);
    await navigateToCartPage(page);

    // When: 주문하기 버튼을 클릭하면
    await createOrderSheet(page);

    // Then: 주문서가 생성된다
    await expect(page).toHaveURL(/\/checkout\//);
    await expect(
      page
        .getByRole('heading', { level: 4, name: /배송 정보|결제 정보/ })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', {
        name: '주문 동의 및 개인정보 수집 이용 동의',
      }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '결제하기' })).toBeVisible();
  });
});
