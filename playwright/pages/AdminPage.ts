import type { Page } from '@playwright/test';

/**
 * AdminPage - Admin 앱 공통 Page Object
 *
 * 로그인 이후 인증된 상태에서 사용하는 기본 네비게이션 헬퍼를 제공합니다.
 * 각 페이지별 POM은 이 클래스를 조합하여 사용합니다.
 */
export class AdminPage {
  constructor(readonly page: Page) {}

  async gotoDashboard() {
    await this.page.goto('/');
    await this.page.waitForURL('/');
  }

  async gotoProducts() {
    await this.page.goto('/products');
    await this.page.waitForURL('/products');
  }

  async gotoProductRegister() {
    await this.page.goto('/products/new');
    await this.page.waitForURL('/products/new');
  }

  async gotoReturns() {
    await this.page.goto('/returns');
    await this.page.waitForURL('/returns');
  }
}

/**
 * DashboardPage - 대시보드 페이지 POM
 */
export class DashboardPage extends AdminPage {
  readonly productStatisticsSection = this.page.getByText('상품 통계');
  readonly sellingProductLabel = this.page.getByText('판매 중 상품');
  readonly soldoutProductLabel = this.page.getByText('품절 상품');

  async waitForPageReady() {
    await this.page.waitForURL('/');
    await this.productStatisticsSection.waitFor({ state: 'visible' });
  }

  getStatValueLocator(label: string) {
    // "판매 중 상품" 텍스트를 가진 p 다음 형제 p에서 값을 가져옵니다.
    return this.page.locator('p', { hasText: label }).locator('..').locator('p').last();
  }
}

/**
 * ReturnsPage - 반품/교환 관리 페이지 POM
 */
export class ReturnsPage extends AdminPage {
  readonly filterBar = this.page.getByRole('button', { name: '전체' });
  readonly allFilterButton = this.page.getByRole('button', { name: '전체' });
  readonly pendingFilterButton = this.page.getByRole('button', { name: '처리 대기' });
  readonly approvedFilterButton = this.page.getByRole('button', { name: '승인' });
  readonly rejectedFilterButton = this.page.getByRole('button', { name: '거부' });

  async waitForPageReady() {
    await this.page.waitForURL('/returns');
    await this.allFilterButton.waitFor({ state: 'visible' });
  }
}

/**
 * ProductsPage - 상품 목록 페이지 POM
 */
export class ProductsPage extends AdminPage {
  readonly searchButton = this.page.getByRole('button', { name: '조회' });
  readonly resetButton = this.page.getByRole('button', { name: '초기화' });
  readonly searchInput = this.page.getByPlaceholder('상품명을 입력해주세요.');

  async waitForPageReady() {
    await this.page.waitForURL('/products');
    await this.searchButton.waitFor({ state: 'visible' });
  }

  async clickSearch() {
    await this.searchButton.click();
    // 네트워크 요청이 완료될 때까지 대기
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * ProductRegisterPage - 상품 등록 페이지 POM
 */
export class ProductRegisterPage extends AdminPage {
  readonly cancelButton = this.page.getByRole('button', { name: '취소' });
  readonly submitButton = this.page.getByRole('button', { name: '등록하기' });
  readonly draftButton = this.page.getByRole('button', { name: '임시저장' });

  async waitForPageReady() {
    await this.page.waitForURL('/products/new');
    await this.cancelButton.waitFor({ state: 'visible' });
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.page.waitForURL('/products');
  }
}
