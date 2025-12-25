import { expect, test } from '@playwright/test';
import { TEST_TIMEOUTS, TOSS_ERROR_CODES } from '../fixtures/test-data';
import { TossMockHelper } from '../helpers/toss-mock.helper';
import { WaitHelper } from '../helpers/wait.helper';

test.describe('결제 플로우', () => {
  test.beforeEach(async ({ page }) => {
    const wait = new WaitHelper(page);

    await page.goto('http://localhost:3000');
    await wait.waitForStableNetwork();

    const firstProduct = page.locator('article').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    await firstProduct.click();
    await wait.waitForStableNetwork();

    const sizeButton = page
      .locator('button')
      .filter({ hasText: /^\d{3}$/ })
      .first();
    if (await sizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sizeButton.click();
      await page.waitForTimeout(500);
    }

    const addToCartButton = page
      .locator('button')
      .filter({
        hasText: /장바구니|담기/i,
      })
      .first();
    await addToCartButton.click();
    await page.waitForTimeout(2000);
  });

  test('전체 결제 프로세스 성공', async ({ page }) => {
    const tossMock = new TossMockHelper(page);
    const wait = new WaitHelper(page);

    await tossMock.mockSuccessPayment();

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const orderButton = page
      .locator('button')
      .filter({
        hasText: /주문하기|결제/i,
      })
      .first();

    await expect(orderButton).toBeVisible({ timeout: 10000 });
    await orderButton.click();

    await wait.waitForNavigation(/\/checkout\//, TEST_TIMEOUTS.LONG);

    await expect(
      page.locator('text=배송 정보').or(page.locator('text=결제 정보')),
    ).toBeVisible({
      timeout: TEST_TIMEOUTS.MEDIUM,
    });

    const allAgreementCheckbox = page
      .locator('text=주문 동의')
      .locator('..')
      .locator('input[type="checkbox"]')
      .first();
    await expect(allAgreementCheckbox).toBeVisible({
      timeout: TEST_TIMEOUTS.MEDIUM,
    });
    await allAgreementCheckbox.check();

    const paymentButton = page.locator('button:has-text("결제하기")');
    await expect(paymentButton).toBeEnabled({ timeout: TEST_TIMEOUTS.SHORT });
    await paymentButton.click();

    await wait.waitForNavigation(/\/confirm\?/, TEST_TIMEOUTS.LONG);

    const confirmUrl = new URL(page.url());
    expect(confirmUrl.searchParams.get('paymentKey')).toBeTruthy();
    expect(confirmUrl.searchParams.get('orderId')).toBeTruthy();
    expect(confirmUrl.searchParams.get('amount')).toBeTruthy();

    await wait.waitForNavigation(/\/complete\//, TEST_TIMEOUTS.LONG);

    const completeUrl = page.url();
    expect(completeUrl).toMatch(/\/complete\//);
  });

  test('결제 실패 시나리오', async ({ page }) => {
    const tossMock = new TossMockHelper(page);
    const wait = new WaitHelper(page);

    await tossMock.mockFailPayment(
      TOSS_ERROR_CODES.USER_CANCEL.code,
      TOSS_ERROR_CODES.USER_CANCEL.message,
    );

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const orderButton = page
      .locator('button')
      .filter({ hasText: /주문하기/i })
      .first();
    await orderButton.click();

    await wait.waitForNavigation(/\/checkout\//, TEST_TIMEOUTS.LONG);

    const agreementCheckbox = page.locator('input[type="checkbox"]').first();
    await agreementCheckbox.check();

    const paymentButton = page.locator('button:has-text("결제하기")');
    await paymentButton.click();

    const { code, message } = await tossMock.waitForFailRedirect(
      TEST_TIMEOUTS.LONG,
    );

    expect(code).toBe(TOSS_ERROR_CODES.USER_CANCEL.code);
    expect(message).toContain('취소');
  });

  test('약관 미동의 시 결제 버튼 비활성화', async ({ page }) => {
    const wait = new WaitHelper(page);

    await page.goto('http://localhost:3000/cart');
    await wait.waitForStableNetwork();

    const orderButton = page
      .locator('button')
      .filter({ hasText: /주문하기/i })
      .first();
    await orderButton.click();

    await wait.waitForNavigation(/\/checkout\//, TEST_TIMEOUTS.LONG);

    const paymentButton = page.locator('button:has-text("결제하기")');
    await expect(paymentButton).toBeDisabled({ timeout: TEST_TIMEOUTS.SHORT });

    const agreementCheckbox = page.locator('input[type="checkbox"]').first();
    await agreementCheckbox.check();

    await expect(paymentButton).toBeEnabled({ timeout: TEST_TIMEOUTS.SHORT });
  });
});
