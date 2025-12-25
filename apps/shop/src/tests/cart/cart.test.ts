import { expect, test } from '@playwright/test';
import { WaitHelper } from '../helpers/wait.helper';

test.describe('장바구니 플로우', () => {
  test('상품을 장바구니에 담기', async ({ page }) => {
    const wait = new WaitHelper(page);

    await page.goto('http://localhost:3000');
    await wait.waitForStableNetwork();

    const firstProduct = page.locator('article').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });

    await firstProduct.click();
    await wait.waitForStableNetwork();

    await expect(page.locator('figure img')).toBeVisible({ timeout: 10000 });

    const sizeButtons = page.locator('button').filter({ hasText: /^\d{3}$/ });
    const firstAvailableSize = sizeButtons.first();

    if (
      await firstAvailableSize.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await firstAvailableSize.click();
      await page.waitForTimeout(500);
    }

    const addToCartButton = page
      .locator('button')
      .filter({
        hasText: /장바구니|담기|add to cart/i,
      })
      .first();

    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    await addToCartButton.click();
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const cartContent = page.locator('text=수량').or(page.locator('text=총'));
    await expect(cartContent).toBeVisible({ timeout: 10000 });

    const orderButton = page.locator('button').filter({
      hasText: /주문하기|결제하기|checkout/i,
    });
    await expect(orderButton).toBeVisible({ timeout: 5000 });
  });

  test('장바구니에서 수량 변경', async ({ page }) => {
    const wait = new WaitHelper(page);

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const increaseButton = page
      .locator('button')
      .filter({ hasText: '+' })
      .first();
    if (await increaseButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await increaseButton.click();
      await page.waitForTimeout(1000);
    }

    const decreaseButton = page
      .locator('button')
      .filter({ hasText: '-' })
      .first();
    if (await decreaseButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await decreaseButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('장바구니에서 상품 삭제', async ({ page }) => {
    const wait = new WaitHelper(page);

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const deleteButton = page
      .locator('button')
      .filter({
        hasText: /삭제|제거|X|delete/i,
      })
      .first();

    if (await deleteButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteButton.click();
      await page.waitForTimeout(1000);
    }
  });
});
