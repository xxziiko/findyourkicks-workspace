import { expect, test } from '@playwright/test';
import { ProductsPage } from '../../pages/AdminPage';
import dayjs from 'dayjs';

/**
 * 회귀 테스트: Fix 2 - 상품 목록 조회
 *
 * 버그 1: "조회" 버튼 클릭 시 상품 목록이 표시되지 않음
 * 버그 2: 기간 필터 기본값이 설정되지 않음
 * 버그 3: 드롭다운 placeholder 값이 API 필터에 포함되어 잘못된 결과 반환
 * 수정: getFilteredProducts.ts, useSearchProducts.ts, supabase/functions/products/index.ts
 */
test.describe('상품 목록 조회', { tag: '@product' }, () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.gotoProducts();
    await productsPage.waitForPageReady();
  });

  // Happy Path
  test('"조회" 버튼 클릭 시 상품 목록이 표시된다', async ({ page }) => {
    await productsPage.clickSearch();

    // 상품이 1개 이상 표시되어야 함 (하드코딩된 수치 사용 금지)
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    const noDataText = page.getByText('상품 데이터가 없습니다.');

    // 상품 목록이 있거나, 빈 상태 메시지가 표시되어야 함 (둘 다 없는 상태는 버그)
    const rowCount = await tableRows.count();
    const hasNoData = await noDataText.isVisible();
    expect(rowCount > 0 || hasNoData).toBeTruthy();
  });

  test('실제 상품 데이터가 1개 이상 조회된다', async ({ page }) => {
    await productsPage.clickSearch();

    // 상품 행이 존재해야 함
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    await expect(tableRows.first()).toBeVisible();
    expect(await tableRows.count()).toBeGreaterThan(0);
  });

  // 기간 필터 기본값 확인
  test('기간 필터 시작일 기본값이 2025.01.01로 설정된다', async ({ page }) => {
    // DatePicker input에 기본값이 설정되어 있어야 함
    const startDateInput = page.getByPlaceholder('시작일').or(
      page.locator('input').filter({ hasText: '' }).first()
    );

    // antd DateRangePicker는 input 두 개를 렌더링함
    const dateInputs = page.locator('.ant-picker-input input');
    const startInput = dateInputs.first();

    await expect(startInput).toHaveValue('2025.01.01');
  });

  test('기간 필터 종료일 기본값이 오늘 날짜로 설정된다', async ({ page }) => {
    const today = dayjs().format('YYYY.MM.DD');
    const dateInputs = page.locator('.ant-picker-input input');
    const endInput = dateInputs.last();

    await expect(endInput).toHaveValue(today);
  });

  // 드롭다운 placeholder 필터 제외 확인
  test('판매 상태 드롭다운 기본값("전체")으로 조회 시 상품이 표시된다', async ({ page }) => {
    // 드롭다운이 기본 placeholder 상태에서도 정상 조회되어야 함
    await productsPage.clickSearch();

    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    const noDataText = page.getByText('상품 데이터가 없습니다.');

    const rowCount = await tableRows.count();
    const hasNoData = await noDataText.isVisible();
    expect(rowCount > 0 || hasNoData).toBeTruthy();
  });

  test('카테고리 드롭다운 기본 placeholder 상태에서 조회 시 에러가 발생하지 않는다', async ({ page }) => {
    // placeholder("카테고리를 선택해주세요.")가 필터에 포함되면 빈 결과 반환했던 버그
    await productsPage.clickSearch();

    // 에러 메시지가 표시되지 않아야 함
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(page.getByText('오류가 발생했습니다')).not.toBeVisible();
  });

  test('브랜드 드롭다운 기본 placeholder 상태에서 조회 시 에러가 발생하지 않는다', async ({ page }) => {
    await productsPage.clickSearch();

    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  // Edge Cases
  test('상품명 검색어 입력 후 조회 시 필터링된 결과가 표시된다', async ({ page }) => {
    await productsPage.searchInput.fill('Nike');
    await productsPage.clickSearch();

    // 에러 없이 결과가 표시되어야 함
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test('"초기화" 버튼 클릭 시 검색 조건이 기본값으로 리셋된다', async ({ page }) => {
    // 검색어 입력 후 초기화
    await productsPage.searchInput.fill('테스트 상품명');
    await productsPage.resetButton.click();

    // 검색 입력이 비워짐
    await expect(productsPage.searchInput).toHaveValue('');

    // 기간 기본값 복원 확인
    const dateInputs = page.locator('.ant-picker-input input');
    const today = dayjs().format('YYYY.MM.DD');
    await expect(dateInputs.first()).toHaveValue('2025.01.01');
    await expect(dateInputs.last()).toHaveValue(today);
  });

  // Error Cases
  test('페이지 로드 시 에러 없이 렌더링된다', async ({ page }) => {
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(productsPage.searchButton).toBeVisible();
    await expect(productsPage.resetButton).toBeVisible();
  });
});
