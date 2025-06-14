import { expect, test } from '@playwright/test';

const SIZES = [
  '190',
  '200',
  '210',
  '220',
  '230',
  '240',
  '250',
  '260',
  '270',
  '280',
  '290',
  '300',
  '310',
  '320',
] as const;

test.describe('상품 등록', () => {
  test('모든 필수 항목을 입력하고 상품 등록에 성공한다', async ({ page }) => {
    const categoryIds = ['category', '운동화', 'brand', 'nike'] as const;
    const inputFields = [
      ['productName', '테스트 상품'],
      ['price', '89000'],
      ['description', '이것은 테스트용 상세 설명입니다.'],
    ] as const;
    const selectedSizes = ['260', '270', '290', '320'] as const;

    await page.goto('http://localhost:5173/');

    await expect(page.getByText('상품관리')).toBeVisible();
    await page.getByText('상품 등록').click();

    // 기본 정보 입력
    for (const id of categoryIds) {
      await page.getByTestId(id).click();
    }
    for (const [id, value] of inputFields) {
      await page.getByTestId(id).fill(value);
    }

    // 사이즈 옵션 선택 및 재고 입력
    for (const size of selectedSizes) {
      await page.getByRole('button', { name: size }).click();
    }

    for (const size of selectedSizes) {
      await expect(page.getByRole('button', { name: size })).toBeDisabled();
    }

    await page.getByTestId('all-stock-input').fill('10');

    for (const size of selectedSizes) {
      await expect(page.getByTestId(`${size}-stock-input`)).toBeVisible();
    }

    // 이미지 업로드
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: '이미지 업로드' }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('apps/admin/src/tests/fixtures/32.webp');

    await page.getByRole('button', { name: '등록하기' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('상품 등록이 완료되었습니다.')).toBeVisible();
  });

  test('필수 항목을 입력하지 않고 상품 등록에 실패한다', async ({ page }) => {
    const ids = [
      'category',
      'brand',
      'productName',
      'price',
      'description',
      'sizes',
      'images',
    ] as const;

    await page.goto('http://localhost:5173/');

    await expect(page.getByText('상품관리')).toBeVisible();
    await page.getByText('상품 등록').click();

    // 등록 버튼 클릭
    await page.getByRole('button', { name: '등록하기' }).click();

    for (const id of ids) {
      await expect(page.getByTestId(`${id}-error`)).toBeVisible();
    }
  });

  test('전체 선택 버튼 동작 테스트', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await expect(page.getByText('상품관리')).toBeVisible();
    await page.getByText('상품 등록').click();

    await page.getByRole('button', { name: '전체 선택' }).click();

    for (const size of SIZES) {
      await expect(page.getByRole('button', { name: size })).toBeDisabled();
    }

    await page.getByTestId('all-stock-input').fill('10');

    for (const size of SIZES) {
      await expect(page.getByTestId(`${size}-stock-input`)).toBeVisible();
    }

    await page.getByRole('button', { name: '전체 선택 해제' }).click();

    for (const size of SIZES) {
      await expect(page.getByRole('button', { name: size })).toBeEnabled();
    }

    await expect(page.getByText('재고 일괄 적용')).not.toBeVisible();
  });
});
