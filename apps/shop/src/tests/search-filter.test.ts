import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('검색/필터 플로우', () => {
  test('/products 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('load');

    // 검색창이 렌더링되는지 확인
    const searchInput = page.getByRole('searchbox', { name: '상품 검색' });
    await searchInput.waitFor({ state: 'visible' });
    await expect(searchInput).toBeVisible();

    // 정렬 드롭다운이 렌더링되는지 확인
    const sortSelect = page.getByRole('combobox', { name: '정렬 방식' });
    await expect(sortSelect).toBeVisible();
  });

  test('검색어 입력 시 URL에 q 파라미터가 반영된다', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('load');

    const searchInput = page.getByRole('searchbox', { name: '상품 검색' });
    await searchInput.waitFor({ state: 'visible' });

    // 검색어 입력 (SearchBar는 300ms 디바운스)
    await searchInput.fill('nike');

    // 300ms 디바운스 + 여유 시간 대기
    await page.waitForTimeout(500);

    // URL에 ?q=nike 포함 확인
    await expect(page).toHaveURL(/[?&]q=nike/);
  });

  test('정렬 선택 시 URL에 sort 파라미터가 반영된다', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('load');

    const sortSelect = page.getByRole('combobox', { name: '정렬 방식' });
    await sortSelect.waitFor({ state: 'visible' });

    // '낮은 가격순' 선택
    await sortSelect.selectOption('price_asc');

    // waitForURL은 Next.js App Router의 pushState를 놓칠 수 있으므로 waitForFunction으로 폴링
    await page.waitForFunction(
      () => window.location.search.includes('sort=price_asc'),
      { timeout: 30000 },
    );
    await expect(page).toHaveURL(/[?&]sort=price_asc/);
  });

  test('상품 목록이 렌더링된다 (빈 상태도 허용)', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('load');

    // useSuspenseInfiniteQuery로 인해 Suspense가 해제될 때까지 대기
    await page.waitForFunction(
      () =>
        document.querySelectorAll('a[href^="/product/"]').length > 0 ||
        document.body.textContent?.includes('검색 결과가 없습니다.'),
      { timeout: 30000 },
    );

    // 상품 그리드 아이템이 있거나 빈 상태 메시지가 표시되어야 함
    const hasProducts = await page
      .locator('a[href^="/product/"]')
      .first()
      .isVisible()
      .catch(() => false);
    const isEmpty = await page
      .locator('text=검색 결과가 없습니다.')
      .isVisible()
      .catch(() => false);

    expect(hasProducts || isEmpty).toBe(true);
  });
});
