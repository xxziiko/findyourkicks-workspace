import { expect, test } from '@playwright/test';
import { ReturnsPage } from '../../pages/AdminPage';

/**
 * 회귀 테스트: Fix 1 - 반품/교환 관리 페이지
 *
 * 버그: /returns 페이지가 ErrorFallback을 렌더링하며 실패함
 * 수정: supabase/functions/admin/index.ts 신규 생성으로 API 엔드포인트 복구
 */
test.describe('반품/교환 관리 페이지', { tag: '@returns' }, () => {
  let returnsPage: ReturnsPage;

  test.beforeEach(async ({ page }) => {
    returnsPage = new ReturnsPage(page);
    await returnsPage.gotoReturns();
    await returnsPage.waitForPageReady();
  });

  // Happy Path
  test('페이지가 ErrorFallback 없이 정상 로딩된다', async ({ page }) => {
    // ErrorFallback 컴포넌트가 렌더링되지 않아야 함
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(page.getByText('오류가 발생했습니다')).not.toBeVisible();

    // 페이지 컨테이너가 정상 렌더링됨
    await expect(returnsPage.allFilterButton).toBeVisible();
  });

  test('탭 필터 4개(전체, 처리 대기, 승인, 거부)가 모두 표시된다', async () => {
    await expect(returnsPage.allFilterButton).toBeVisible();
    await expect(returnsPage.pendingFilterButton).toBeVisible();
    await expect(returnsPage.approvedFilterButton).toBeVisible();
    await expect(returnsPage.rejectedFilterButton).toBeVisible();
  });

  // Edge Cases
  test('"처리 대기" 탭 클릭 시 필터가 활성화된다', async ({ page }) => {
    await returnsPage.pendingFilterButton.click();

    // 버튼이 여전히 표시되고 클릭 가능한 상태
    await expect(returnsPage.pendingFilterButton).toBeVisible();

    // 페이지가 깨지지 않음
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test('"승인" 탭 클릭 시 필터가 활성화된다', async ({ page }) => {
    await returnsPage.approvedFilterButton.click();

    await expect(returnsPage.approvedFilterButton).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test('"거부" 탭 클릭 시 필터가 활성화된다', async ({ page }) => {
    await returnsPage.rejectedFilterButton.click();

    await expect(returnsPage.rejectedFilterButton).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test('"전체" 탭으로 돌아올 수 있다', async ({ page }) => {
    // 다른 탭으로 이동 후 전체로 복귀
    await returnsPage.pendingFilterButton.click();
    await returnsPage.allFilterButton.click();

    await expect(returnsPage.allFilterButton).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  // 테이블 헤더 확인
  test('반품/교환 테이블 헤더가 정상 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: '주문 ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '상품명' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '유형' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '사유' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '상태' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '신청일' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '처리' })).toBeVisible();
  });
});
