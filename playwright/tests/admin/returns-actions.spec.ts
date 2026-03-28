import { expect, test } from '@playwright/test';
import { ReturnsPage } from '../../pages/AdminPage';

test.describe('반품/교환 액션 처리', { tag: '@returns' }, () => {
  let returnsPage: ReturnsPage;

  test.beforeEach(async ({ page }) => {
    returnsPage = new ReturnsPage(page);
    await returnsPage.gotoReturns();
    await returnsPage.waitForPageReady();
  });

  test('처리 대기 탭에서 반품 요청이 표시된다', async ({ page }) => {
    await returnsPage.pendingFilterButton.click();

    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(returnsPage.pendingFilterButton).toBeVisible();

    // 데이터가 있는 경우에만 승인/거부 버튼 확인
    const approveCount = await returnsPage.approveButtons.count();
    if (approveCount > 0) {
      await expect(returnsPage.approveButtons.first()).toBeVisible();
      await expect(returnsPage.rejectButtons.first()).toBeVisible();
    }
  });

  test('승인 버튼 클릭 시 처리 완료로 전환된다', async ({ page }) => {
    await returnsPage.pendingFilterButton.click();

    const approveCount = await returnsPage.approveButtons.count();
    if (approveCount === 0) {
      test.skip();
      return;
    }

    await returnsPage.approveButtons.first().click();

    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(returnsPage.processedTexts.first()).toBeVisible();
  });

  test('거부 버튼 클릭 시 처리 완료로 전환된다', async ({ page }) => {
    await returnsPage.pendingFilterButton.click();

    const rejectCount = await returnsPage.rejectButtons.count();
    if (rejectCount === 0) {
      test.skip();
      return;
    }

    await returnsPage.rejectButtons.first().click();

    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(returnsPage.processedTexts.first()).toBeVisible();
  });

  test('이미 처리된 항목에는 액션 버튼이 표시되지 않는다', async ({ page }) => {
    // 승인 탭에는 이미 처리된 항목만 존재해야 함
    await returnsPage.approvedFilterButton.click();

    await expect(page.getByText('Something went wrong')).not.toBeVisible();

    // 처리된 항목이 있는 경우 승인/거부 버튼이 없어야 함
    const processedCount = await returnsPage.processedTexts.count();
    if (processedCount > 0) {
      // 처리 완료 텍스트가 있는 행에는 승인 버튼이 없어야 함
      const approveCount = await returnsPage.approveButtons.count();
      expect(approveCount).toBe(0);
    }
  });
});
