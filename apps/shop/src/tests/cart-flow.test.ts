import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('장바구니 플로우', () => {
  test('상품 페이지에서 사이즈 선택 후 장바구니 추가 시 장바구니 카운트가 증가한다', async ({
    page,
  }) => {
    // Start from home page and navigate to the first available product
    await page.goto(BASE_URL);
    await page.waitForLoadState('load');

    // Click the first product link that goes to /product/[id]
    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.waitFor({ state: 'visible' });
    await firstProductLink.click();
    await page.waitForLoadState('load');

    // Verify we are on a product detail page
    await expect(page).toHaveURL(/\/product\//);

    // Read cart count before adding to cart (may not exist if 0)
    const cartNavLink = page.locator('a[href="/cart"]');
    await cartNavLink.waitFor({ state: 'visible' });

    const badgeBefore = cartNavLink.locator('span');
    const countBefore = (await badgeBefore.isVisible())
      ? Number(await badgeBefore.innerText())
      : 0;

    // Select the first available (enabled) size button
    const sizeButton = page
      .getByRole('button')
      .filter({ hasNot: page.locator('[disabled]') })
      .first();
    await sizeButton.waitFor({ state: 'visible' });
    await sizeButton.click();

    // Click the "장바구니" (add to cart) button
    await page.getByRole('button', { name: '장바구니' }).click();

    // Wait for the mutation to settle — badge should update
    await page.waitForLoadState('load');

    // Cart badge should now be visible and count should have increased
    await expect(badgeBefore).toBeVisible();
    const countAfter = Number(await badgeBefore.innerText());
    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('/cart 페이지에 접근하면 장바구니 상품 목록이 표시된다', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/cart`);
    await page.waitForLoadState('load');

    // Should stay on cart page (authenticated)
    await expect(page).toHaveURL(`${BASE_URL}/cart`);

    // Cart page renders either items or the empty-state message
    const cartList = page.locator('ul, [class*="list"]').first();
    await cartList.waitFor({ state: 'visible' });

    // If there are cart items, the table header "상품/옵션 정보" should be visible
    // If empty, the "장바구니가 비어있어요!" message should be visible
    const hasItems = await page.locator('text=상품/옵션 정보').isVisible();
    const isEmpty = await page
      .locator('text=장바구니가 비어있어요!')
      .isVisible();

    expect(hasItems || isEmpty).toBe(true);
  });

  test('/cart 페이지에 장바구니 상품이 있을 때 주문하기 버튼이 표시된다', async ({
    page,
  }) => {
    // First ensure there is at least one item in the cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('load');

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.waitFor({ state: 'visible' });
    await firstProductLink.click();
    await page.waitForLoadState('load');

    const sizeButton = page
      .getByRole('button')
      .filter({ hasNot: page.locator('[disabled]') })
      .first();
    await sizeButton.waitFor({ state: 'visible' });
    await sizeButton.click();
    await page.getByRole('button', { name: '장바구니' }).click();
    await page.waitForLoadState('load');

    // Navigate to cart
    await page.goto(`${BASE_URL}/cart`);
    await page.waitForLoadState('load');

    // The bulk order button text contains "주문하기"
    const orderButton = page
      .getByRole('button')
      .filter({ hasText: /주문하기/ })
      .first();
    await orderButton.waitFor({ state: 'visible' });
    await expect(orderButton).toBeVisible();
  });

  test('장바구니 페이지에서 주문하기를 클릭하면 checkout 페이지로 이동한다', async ({
    page,
  }) => {
    // Ensure there is at least one item in the cart
    await page.goto(BASE_URL);
    await page.waitForLoadState('load');

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.waitFor({ state: 'visible' });
    await firstProductLink.click();
    await page.waitForLoadState('load');

    const sizeButton = page
      .getByRole('button')
      .filter({ hasNot: page.locator('[disabled]') })
      .first();
    await sizeButton.waitFor({ state: 'visible' });
    await sizeButton.click();
    await page.getByRole('button', { name: '장바구니' }).click();
    await page.waitForLoadState('load');

    // Navigate to cart
    await page.goto(`${BASE_URL}/cart`);
    await page.waitForLoadState('load');

    // Click the first individual "주문하기" button (single product order)
    const singleOrderButton = page
      .getByRole('button', { name: '주문하기' })
      .first();
    await singleOrderButton.waitFor({ state: 'visible' });
    await singleOrderButton.click();

    // Should navigate to /checkout/[id]
    await page.waitForURL(/\/checkout\//);
    await expect(page).toHaveURL(/\/checkout\//);
  });
});
