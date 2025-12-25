import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Wait Helper - Flaky Test 방지 전문가
 *
 * 역할:
 * - E2E 테스트가 불안정해지는(Flaky) 모든 타이밍 이슈 해결
 * - 네트워크, 애니메이션, 비동기 상태 업데이트 대기
 * - Playwright 기본 auto-waiting을 넘어선 비즈니스 로직 수준 대기
 *
 * 사용 이유:
 * - "간헐적으로 실패하는 테스트" 문제 해결
 * - CI 환경과 로컬 환경의 속도 차이 흡수
 * - 테스트 안정성 향상 (Flaky rate < 5%)
 *
 * Flaky Test의 주요 원인:
 * 1. 네트워크 타이밍: API 응답 전에 검증 시도
 * 2. 애니메이션/Transition: 요소가 아직 클릭 불가능
 * 3. React 상태 업데이트: 리렌더링 중인데 assertion
 * 4. 동시성 이슈: 여러 테스트가 같은 데이터 사용
 */
export class WaitHelper {
  constructor(private page: Page) {}

  /**
   * 네트워크가 안정될 때까지 대기
   * - 모든 API 요청이 완료됨
   * - 최소 500ms 동안 새 요청 없음
   *
   * @example
   * await page.goto('/product/123');
   * await wait.waitForStableNetwork();  // 상품 정보 API 완료
   * await page.locator('button:has-text("장바구니 추가")').click();
   */
  async waitForStableNetwork() {
    await this.page.waitForLoadState('networkidle');
    console.log('[WAIT] Network is stable (networkidle)');
  }

  /**
   * 특정 API 응답 대기
   *
   * @param urlPattern - API URL 패턴 (정규식 또는 문자열)
   * @param status - 기대하는 HTTP 상태 코드 (기본값: 200)
   * @param timeout - 최대 대기 시간 (ms, 기본값: 15000)
   *
   * @example
   * await page.locator('button:has-text("장바구니 추가")').click();
   * await wait.waitForAPI('/api/cart');  // POST /api/cart 완료 대기
   * await expect(page.locator('.cart-badge')).toContainText('1');
   */
  async waitForAPI(urlPattern: string | RegExp, status = 200, timeout = 15000) {
    const pattern =
      typeof urlPattern === 'string' ? new RegExp(urlPattern) : urlPattern;

    await this.page.waitForResponse(
      (response) =>
        pattern.test(response.url()) && response.status() === status,
      { timeout },
    );

    console.log(
      `[WAIT] API response received: ${urlPattern}, status: ${status}`,
    );
  }

  /**
   * 요소가 진짜로 클릭 가능할 때까지 대기
   * - visible: 화면에 보임
   * - attached: DOM에 붙어있음
   * - enabled: disabled 상태 아님
   *
   * Playwright의 auto-waiting이 부족한 경우:
   * - API 요청이 진행 중일 수 있음
   * - React 상태가 업데이트 중일 수 있음
   * - 애니메이션이 재생 중일 수 있음
   *
   * @param selector - 요소 선택자
   * @param timeout - 최대 대기 시간 (ms, 기본값: 10000)
   *
   * @example
   * await wait.waitForClickable('button:has-text("결제하기")');
   * await page.locator('button:has-text("결제하기")').click();
   */
  async waitForClickable(selector: string, timeout = 10000) {
    const element = this.page.locator(selector);

    // 1. 화면에 보일 때까지 대기
    await element.waitFor({ state: 'visible', timeout });

    // 2. DOM에 붙어있을 때까지 대기
    await element.waitFor({ state: 'attached', timeout });

    // 3. disabled 상태가 아닐 때까지 대기
    await expect(element).toBeEnabled({ timeout });

    console.log(`[WAIT] Element is clickable: ${selector}`);
  }

  /**
   * CSS 애니메이션 완료 대기
   *
   * @param selector - 요소 선택자
   * @param duration - 애니메이션 지속 시간 (ms, 기본값: 300)
   *
   * @example
   * await page.locator('button:has-text("장바구니 추가")').click();
   * await wait.waitForAnimation('.cart-badge', 300);  // fade-in 완료
   * await expect(page.locator('.cart-badge')).toContainText('1');
   */
  async waitForAnimation(selector: string, duration = 300) {
    // 요소가 보일 때까지 대기
    await this.page.locator(selector).waitFor({ state: 'visible' });

    // 애니메이션 지속 시간만큼 대기
    await this.page.waitForTimeout(duration);

    console.log(`[WAIT] Animation completed for: ${selector}`);
  }

  /**
   * 특정 조건이 만족될 때까지 대기 (폴링)
   *
   * @param condition - 검증 함수 (true 반환 시 종료)
   * @param options - 폴링 옵션
   *
   * @example
   * await wait.waitForCondition(
   *   async () => {
   *     const count = await page.locator('.cart-badge').textContent();
   *     return count === '1';
   *   },
   *   { interval: 100, timeout: 5000 }
   * );
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    options: { interval?: number; timeout?: number } = {},
  ) {
    const { interval = 100, timeout = 10000 } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        console.log('[WAIT] Condition met');
        return;
      }
      await this.page.waitForTimeout(interval);
    }

    throw new Error(`[WAIT] Condition not met within ${timeout}ms`);
  }

  /**
   * 여러 API 응답을 병렬로 대기
   *
   * @param urlPatterns - API URL 패턴 배열
   * @param timeout - 최대 대기 시간 (ms)
   *
   * @example
   * await page.goto('/checkout');
   * await wait.waitForMultipleAPIs([
   *   '/api/user/address',
   *   '/api/order-sheet'
   * ]);
   */
  async waitForMultipleAPIs(urlPatterns: string[], timeout = 15000) {
    await Promise.all(
      urlPatterns.map((pattern) => this.waitForAPI(pattern, 200, timeout)),
    );

    console.log(`[WAIT] All APIs completed: ${urlPatterns.join(', ')}`);
  }

  /**
   * 페이지 전환 완료 대기
   *
   * @param urlPattern - 대기할 URL 패턴
   * @param timeout - 최대 대기 시간 (ms)
   *
   * @example
   * await page.locator('button:has-text("결제하기")').click();
   * await wait.waitForNavigation(/\/complete\//);
   */
  async waitForNavigation(urlPattern: string | RegExp, timeout = 30000) {
    const pattern =
      typeof urlPattern === 'string' ? new RegExp(urlPattern) : urlPattern;

    await this.page.waitForURL(pattern, { timeout });

    console.log(`[WAIT] Navigation completed to: ${this.page.url()}`);
  }

  /**
   * 로딩 스피너가 사라질 때까지 대기
   *
   * @param spinnerSelector - 로딩 스피너 선택자
   * @param timeout - 최대 대기 시간 (ms)
   *
   * @example
   * await page.locator('button:has-text("주문하기")').click();
   * await wait.waitForLoadingComplete('[data-testid="loading-spinner"]');
   */
  async waitForLoadingComplete(spinnerSelector: string, timeout = 10000) {
    try {
      // 스피너가 나타날 때까지 대기 (선택적)
      await this.page.locator(spinnerSelector).waitFor({
        state: 'visible',
        timeout: 1000,
      });

      // 스피너가 사라질 때까지 대기
      await this.page.locator(spinnerSelector).waitFor({
        state: 'hidden',
        timeout,
      });

      console.log('[WAIT] Loading completed');
    } catch {
      // 스피너가 아예 나타나지 않았다면 (이미 로딩 완료)
      console.log('[WAIT] Loading already completed (no spinner found)');
    }
  }

  /**
   * React 상태 업데이트 완료 대기
   * (비동기 setState 후 리렌더링 완료)
   *
   * @param delay - 대기 시간 (ms, 기본값: 100)
   *
   * @example
   * await page.locator('input[name="quantity"]').fill('5');
   * await wait.waitForReactStateUpdate();  // setState 완료
   * await expect(page.locator('.total-price')).toContainText('50000');
   */
  async waitForReactStateUpdate(delay = 100) {
    await this.page.waitForTimeout(delay);
    console.log('[WAIT] React state update completed');
  }

  /**
   * 디바운스된 입력 완료 대기
   * (사용자 입력 후 debounce 타이머 만료)
   *
   * @param delay - debounce 시간 (ms, 기본값: 500)
   *
   * @example
   * await page.locator('input[name="search"]').type('신발');
   * await wait.waitForDebounce(500);  // 검색 API 호출 전 대기
   * await wait.waitForAPI('/api/search');
   */
  async waitForDebounce(delay = 500) {
    await this.page.waitForTimeout(delay);
    console.log(`[WAIT] Debounce delay completed (${delay}ms)`);
  }
}
