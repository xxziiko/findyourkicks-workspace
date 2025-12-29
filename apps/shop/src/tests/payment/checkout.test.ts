import { expect, test } from '@playwright/test';
import { TEST_TIMEOUTS, TOSS_ERROR_CODES } from '../fixtures/test-data';
import {
  agreeAndPay,
  extractOrderIdFromUrl,
  getCheckoutElements,
  navigateToCheckoutPage,
} from './checkout.helper';
import { TossMockHelper } from './toss-mock.helper';

test.describe('결제 플로우', () => {
  test('사용자가 전체 결제 프로세스를 성공적으로 완료할 수 있다', async ({
    page,
  }) => {
    // Given: Mock을 먼저 설정
    const tossMock = new TossMockHelper(page);
    await tossMock.mockSuccessPayment();

    // 결제 페이지로 이동 (Mock이 적용됨)
    const orderIdFromCheckout = await navigateToCheckoutPage(page);

    // orderId 검증
    expect(orderIdFromCheckout).toBeTruthy();
    expect(orderIdFromCheckout).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    ); // UUID v4 형식

    // 체크박스 초기 상태 검증
    const { agreementCheckbox } = getCheckoutElements(page);
    await expect(agreementCheckbox).toBeVisible();
    expect(await agreementCheckbox.isChecked()).toBe(false);

    // When: 약관에 동의하고 결제하기 버튼을 클릭하면
    await agreementCheckbox.check();
    expect(await agreementCheckbox.isChecked()).toBe(true);

    const { paymentButton } = getCheckoutElements(page);
    await expect(paymentButton).toBeEnabled();
    await paymentButton.click();

    // Then: 결제 완료 페이지로 이동한다
    await page.waitForURL(/\/complete\/[^/]+$/, {
      timeout: TEST_TIMEOUTS.LONG,
    });

    // orderId가 checkout과 complete에서 일치하는지 확인
    const orderIdFromComplete = extractOrderIdFromUrl(page.url(), 'complete');
    expect(orderIdFromComplete).toBe(orderIdFromCheckout);
    expect(orderIdFromComplete).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  test('사용자가 결제를 취소하면 실패 처리된다', async ({ page }) => {
    // Given: Mock을 먼저 설정
    const tossMock = new TossMockHelper(page);
    await tossMock.mockFailPayment(
      TOSS_ERROR_CODES.USER_CANCEL.code,
      TOSS_ERROR_CODES.USER_CANCEL.message,
    );

    // 결제 페이지로 이동 (Mock이 적용됨)
    const orderIdFromCheckout = await navigateToCheckoutPage(page);
    expect(orderIdFromCheckout).toBeTruthy();

    // When: 약관에 동의하고 결제하기 버튼을 클릭하면
    await agreeAndPay(page);

    // Then: 실패 페이지로 리다이렉트된다
    const { code, message } = await tossMock.waitForFailRedirect(
      TEST_TIMEOUTS.LONG,
    );

    // 에러 코드와 메시지 검증
    expect(code).toBe(TOSS_ERROR_CODES.USER_CANCEL.code);
    expect(message).toContain('취소');

    // URL에 orderId가 포함되어 있는지 확인
    const failUrl = page.url();
    expect(failUrl).toContain(orderIdFromCheckout);
  });

  test('사용자가 약관에 동의하지 않으면 결제 버튼이 비활성화된다', async ({
    page,
  }) => {
    // Given: 결제 페이지로 이동
    await navigateToCheckoutPage(page);

    const { agreementCheckbox, paymentButton } = getCheckoutElements(page);

    // Then: 초기 상태 - 약관 미동의, 버튼 비활성화
    await expect(agreementCheckbox).toBeVisible();
    expect(await agreementCheckbox.isChecked()).toBe(false);
    await expect(paymentButton).toBeVisible();
    await expect(paymentButton).toBeDisabled();

    // When: 약관에 동의하면
    await agreementCheckbox.check();

    // Then: 체크박스가 체크되고, 버튼이 활성화된다
    expect(await agreementCheckbox.isChecked()).toBe(true);
    await expect(paymentButton).toBeEnabled();

    // When: 약관 동의를 해제하면
    await agreementCheckbox.uncheck();

    // Then: 다시 버튼이 비활성화된다
    expect(await agreementCheckbox.isChecked()).toBe(false);
    await expect(paymentButton).toBeDisabled();
  });
});
