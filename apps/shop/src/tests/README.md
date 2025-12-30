# E2E 테스트 가이드

## 테스트 철학

**실제 사용자 행동을 그대로 테스트합니다.**
- Mock은 최소화 (Toss SDK만 Mock)
- 실제 DB 데이터 사용
- 실제 UI 인터랙션
- 실제 API 호출

## 테스트 실행 전 준비사항

### 1. DB Seed (필수)

테스트를 위해 DB에 다음 데이터가 필요합니다:

```sql
-- Supabase Studio 또는 SQL Editor에서 실행
-- supabase/seed.sql 파일 참고

-- 1. 상품 및 재고 데이터
-- 2. 테스트 사용자 기본 배송지
```

**필요한 데이터:**
- ✅ 상품 데이터 (products)
- ✅ 재고 정보 (inventory) - `product_id`, `size` 별로 필요
- ✅ 테스트 사용자 계정
- ✅ 테스트 사용자의 기본 배송지 (is_default = true)

### 2. 테스트 실행

```bash
# 전체 E2E 테스트 실행
PLAYWRIGHT_WEBSERVER=shop pnpm exec playwright test --project=shop

# 장바구니 테스트만
PLAYWRIGHT_WEBSERVER=shop pnpm exec playwright test cart.test.ts

# 결제 플로우 테스트만
PLAYWRIGHT_WEBSERVER=shop pnpm exec playwright test checkout.test.ts

# UI 모드 (디버깅)
PLAYWRIGHT_WEBSERVER=shop pnpm exec playwright test --ui

# Headed 모드 (브라우저 보면서 실행)
PLAYWRIGHT_WEBSERVER=shop pnpm exec playwright test --headed
```

## 테스트 전략

### 실제 사용자 플로우

**1. 장바구니 테스트** ([cart.test.ts](cart/cart.test.ts))
```
홈 → 상품 클릭 → 사이즈 선택 → 장바구니 담기 → 장바구니 페이지 확인
```

**2. 결제 테스트** ([checkout.test.ts](payment/checkout.test.ts))
```
장바구니에 상품 담기 → 주문하기 → 체크아웃 → 약관 동의 → 결제 → 완료
```

### Mock 전략

**오직 Toss SDK만 Mock:**
- 이유: Cross-origin iframe으로 제어 불가능
- 방법: `page.addInitScript()`로 SDK 주입 전에 Mock

**나머지는 모두 실제:**
- ✅ 상품 조회
- ✅ 장바구니 추가/조회
- ✅ 주문서 생성
- ✅ 배송지 조회
- ✅ 약관 동의
- ✅ 주문 생성 API

### 테스트 구조

```
apps/shop/src/tests/
├── helpers/
│   ├── toss-mock.helper.ts      # Toss SDK Mock (유일한 Mock!)
│   └── wait.helper.ts           # 네트워크 안정화 대기
├── fixtures/
│   └── test-data.ts             # 테스트 상수 (타임아웃, 에러 코드)
├── cart/
│   └── cart.test.ts             # 장바구니 실제 사용자 플로우
├── payment/
│   └── checkout.test.ts         # 결제 실제 사용자 플로우
└── login.setup.ts               # 로그인 Setup
```

## 주요 차이점 (기존 접근 vs 현재 접근)

### ❌ 이전 방식 (잘못된 접근)
```typescript
// Fixture로 API 직접 호출
await page.request.post('/api/cart/items', { data: [...] });
await page.goto('/checkout/[미리-생성된-ID]');
```

### ✅ 현재 방식 (올바른 접근)
```typescript
// 실제 사용자처럼 UI 클릭
await page.goto('/');
await page.locator('article').first().click();
await page.locator('button:has-text("장바구니")').click();
await page.goto('/cart');
await page.locator('button:has-text("주문하기")').click();
// → 주문서가 자동 생성되고 체크아웃 페이지로 이동
```

## 테스트 독립성

각 테스트는 `beforeEach`에서 독립적으로 상품을 장바구니에 담습니다:
```typescript
test.beforeEach(async ({ page }) => {
  // 매번 새로운 상품을 장바구니에 담아서 테스트 독립성 보장
  await page.goto('/');
  await page.locator('article').first().click();
  // ...
});
```

## 문제 해결

### "재고 정보를 찾을 수 없습니다" 에러

```
Failed to add to cart: 404 - {"error":"재고 정보를 찾을 수 없습니다."}
```

**원인:** DB의 `inventory` 테이블에 데이터가 없음

**해결:**
```sql
-- Supabase Studio에서 실행
-- supabase/seed.sql 참고
INSERT INTO inventory (product_id, size, stock, created_at, updated_at)
VALUES ('product-id', '270', 100, NOW(), NOW());
```

### "배송 정보를 찾을 수 없습니다" 에러

**원인:** 테스트 사용자의 기본 배송지가 없음

**해결:**
```sql
-- 테스트 사용자 ID 확인 후
INSERT INTO addresses (user_id, recipient_name, address, is_default, ...)
VALUES ('user-id', '테스트', '서울시...', true, ...);
```

### 상품이 화면에 표시되지 않음

**원인:** DB에 상품 데이터가 없거나, 이미지 URL이 잘못됨

**확인:**
```sql
SELECT * FROM products LIMIT 10;
```

### Toss Mock이 작동하지 않음

**확인 사항:**
1. `TossMockHelper.mockSuccessPayment()`가 `page.goto()` 전에 호출되었는지
2. 브라우저 콘솔에 `[MOCK]` 로그가 표시되는지

## DB Seed 예시

[supabase/seed.sql](../../../../supabase/seed.sql) 파일:

```sql
-- 1. 모든 상품에 재고 정보 생성
DO $$
DECLARE
    product_record RECORD;
    size_value TEXT;
BEGIN
    FOR product_record IN SELECT id FROM products LOOP
        FOREACH size_value IN ARRAY ARRAY['250', '255', '260', '265', '270', '275', '280', '285', '290', '295', '300'] LOOP
            INSERT INTO inventory (product_id, size, stock, created_at, updated_at)
            VALUES (product_record.id, size_value, 100, NOW(), NOW())
            ON CONFLICT (product_id, size) DO UPDATE
            SET stock = 100, updated_at = NOW();
        END LOOP;
    END LOOP;
END $$;

-- 2. 테스트 사용자 기본 배송지
INSERT INTO addresses (user_id, recipient_name, phone_number, postal_code, address, detail_address, is_default, created_at, updated_at)
VALUES ('YOUR_TEST_USER_ID', '테스트 사용자', '010-1234-5678', '06234', '서울특별시 강남구', '123호', true, NOW(), NOW())
ON CONFLICT DO NOTHING;
```

## 다음 단계

- [x] 실제 사용자 플로우 테스트 구현
- [x] Mock 최소화 (Toss SDK만)
- [x] 실제 DB 데이터 사용
- [ ] DB Seed 스크립트 자동화
- [ ] CI/CD 환경 설정
- [ ] 추가 시나리오 (배송지 변경, 재고 부족 등)
