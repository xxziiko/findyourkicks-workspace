import type { Page } from '@playwright/test';

/**
 * Toss Payments SDK Mock Helper
 *
 * 역할:
 * - Toss SDK의 loadTossPayments 함수를 Mock하여 실제 결제창 없이 테스트
 * - cross-origin iframe 제어 불가 문제를 우회
 * - 성공/실패 리다이렉트만 시뮬레이션
 *
 * 사용 이유:
 * - Toss iframe은 보안상 Playwright로 직접 제어 불가
 * - 실제 결제 API 호출 없이 전체 플로우 테스트 가능
 * - CI/CD에서 빠르고 안정적인 테스트 실행
 */
export class TossMockHelper {
  constructor(private page: Page) {}

  /**
   * Toss SDK를 Mock하여 결제 성공 시뮬레이션
   *
   * @example
   * const tossMock = new TossMockHelper(page);
   * await tossMock.mockSuccessPayment();
   * await page.locator('button:has-text("결제하기")').click();
   * // → 즉시 /confirm?paymentKey=xxx&orderId=xxx&amount=xxx로 이동
   */
  async mockSuccessPayment() {
    await this.page.addInitScript(() => {
      // window 객체에 Toss SDK Mock 주입
      (window as any).loadTossPayments = async (clientKey: string) => {
        console.log('[MOCK] Toss SDK loaded with clientKey:', clientKey);

        return {
          payment: ({ customerKey }: { customerKey: string }) => ({
            requestPayment: async (options: any) => {
              console.log('[MOCK] requestPayment called with:', options);

              // Mock: 성공 시뮬레이션 - successUrl로 리다이렉트
              const mockPaymentKey = `mock_payment_${Date.now()}`;
              const successUrl = new URL(
                options.successUrl,
                window.location.origin,
              );

              successUrl.searchParams.append('paymentKey', mockPaymentKey);
              successUrl.searchParams.append('orderId', options.orderId);
              successUrl.searchParams.append(
                'amount',
                String(options.amount.value),
              );

              console.log('[MOCK] Redirecting to:', successUrl.toString());
              window.location.href = successUrl.toString();
            },
          }),
        };
      };
    });
  }

  /**
   * Toss SDK를 Mock하여 결제 실패 시뮬레이션
   *
   * @param errorCode - Toss 에러 코드 (예: 'USER_CANCEL', 'EXCEED_CARD_LIMIT')
   * @param errorMessage - 사용자에게 표시할 에러 메시지
   *
   * @example
   * await tossMock.mockFailPayment('USER_CANCEL', '사용자가 결제를 취소했습니다');
   * await page.locator('button:has-text("결제하기")').click();
   * // → 즉시 /fail?code=USER_CANCEL&message=...로 이동
   */
  async mockFailPayment(
    errorCode = 'USER_CANCEL',
    errorMessage = '사용자가 결제를 취소했습니다',
  ) {
    await this.page.addInitScript(
      ({ code, message }) => {
        (window as any).loadTossPayments = async (clientKey: string) => {
          console.log(
            '[MOCK] Toss SDK loaded (FAIL mode) with clientKey:',
            clientKey,
          );

          return {
            payment: ({ customerKey }: { customerKey: string }) => ({
              requestPayment: async (options: any) => {
                console.log(
                  '[MOCK] requestPayment called (will fail):',
                  options,
                );

                // Mock: 실패 시뮬레이션 - failUrl로 리다이렉트
                const failUrl = new URL(
                  options.failUrl,
                  window.location.origin,
                );

                failUrl.searchParams.append('code', code);
                failUrl.searchParams.append('message', message);
                failUrl.searchParams.append('orderId', options.orderId);

                console.log(
                  '[MOCK] Redirecting to fail URL:',
                  failUrl.toString(),
                );
                window.location.href = failUrl.toString();
              },
            }),
          };
        };
      },
      { code: errorCode, message: errorMessage },
    );
  }

  /**
   * Toss SDK Mock을 제거하고 실제 SDK 사용
   *
   * 주의: 실제 Toss 테스트 키가 필요하며,
   * CI/CD 환경에서는 사용하지 않는 것을 권장
   *
   * @example
   * // 통합 테스트에서만 사용
   * if (process.env.USE_REAL_TOSS_API === 'true') {
   *   await tossMock.useRealTossSDK();
   * }
   */
  async useRealTossSDK() {
    // Mock 제거 - 아무것도 주입하지 않음
    // 실제 Toss SDK가 로드됨
    console.log('[INFO] Using real Toss SDK (no mock)');
  }

  /**
   * 결제 완료 페이지로의 리다이렉트 대기
   *
   * @param timeout - 최대 대기 시간 (ms)
   * @returns 주문 ID
   *
   * @example
   * await tossMock.mockSuccessPayment();
   * await page.locator('button:has-text("결제하기")').click();
   * const orderId = await tossMock.waitForCompleteRedirect();
   */
  async waitForCompleteRedirect(timeout = 30000): Promise<string> {
    await this.page.waitForURL(/\/complete\/[^/]+$/, { timeout });

    const url = this.page.url();
    const orderId = url.split('/').pop() || '';

    console.log('[MOCK] Redirected to complete page, orderId:', orderId);
    return orderId;
  }

  /**
   * 실패 페이지로의 리다이렉트 대기
   *
   * @param timeout - 최대 대기 시간 (ms)
   * @returns 에러 코드와 메시지
   *
   * @example
   * await tossMock.mockFailPayment('USER_CANCEL');
   * await page.locator('button:has-text("결제하기")').click();
   * const { code, message } = await tossMock.waitForFailRedirect();
   */
  async waitForFailRedirect(
    timeout = 30000,
  ): Promise<{ code: string; message: string }> {
    await this.page.waitForURL(/\/fail\?/, { timeout });

    const url = new URL(this.page.url());
    const code = url.searchParams.get('code') || '';
    const message = url.searchParams.get('message') || '';

    console.log(
      '[MOCK] Redirected to fail page, code:',
      code,
      'message:',
      message,
    );
    return { code, message };
  }
}
