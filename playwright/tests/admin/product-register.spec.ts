import { expect, test } from '@playwright/test';
import { ProductRegisterPage } from '../../pages/AdminPage';

/**
 * 회귀 테스트: Fix 3 - 상품 등록 취소 버튼
 *
 * 버그: "취소" 버튼 클릭 시 form reset만 수행하고 페이지를 유지함
 * 수정: ProductRegister.tsx - onResetClick 핸들러를 navigate(PATH.products)로 변경
 */
test.describe('상품 등록 취소 버튼', { tag: '@product' }, () => {
  let registerPage: ProductRegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new ProductRegisterPage(page);
    await registerPage.gotoProductRegister();
    await registerPage.waitForPageReady();
  });

  // Happy Path
  test('"취소" 버튼 클릭 시 /products 페이지로 이동한다', async ({ page }) => {
    await registerPage.clickCancel();

    await expect(page).toHaveURL('/products');
  });

  test('"취소" 버튼 클릭 후 상품 목록 페이지가 정상 렌더링된다', async ({ page }) => {
    await registerPage.clickCancel();

    await page.waitForURL('/products');
    // 상품 목록 페이지의 "조회" 버튼이 보여야 함
    await expect(page.getByRole('button', { name: '조회' })).toBeVisible();
  });

  // Edge Cases — 버그 재발 방지: form reset만 하고 페이지 유지하는 동작
  test('"취소" 버튼 클릭 후 /products/new URL을 유지하지 않는다', async ({ page }) => {
    await registerPage.cancelButton.click();
    await page.waitForURL('/products');

    // 상품 등록 페이지에 남아있으면 버그 재발
    await expect(page).not.toHaveURL('/products/new');
  });

  test('"취소" 버튼이 페이지에 표시된다', async () => {
    await expect(registerPage.cancelButton).toBeVisible();
  });

  test('"등록하기" 버튼과 "임시저장" 버튼도 함께 표시된다', async () => {
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.draftButton).toBeVisible();
  });

  // Error Cases
  test('상품 등록 페이지가 에러 없이 로딩된다', async ({ page }) => {
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    await expect(page.getByText('오류가 발생했습니다')).not.toBeVisible();
  });
});
