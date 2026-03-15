# Fix Plan — Admin QA 발견 이슈 4건

## Context
agent-browser CLI로 어드민 앱 전체 QA를 수행한 결과 발견된 4건의 버그를 수정한다.
심각도 순서대로 Fix 1 → 2 → 3 → 4로 진행.

---

## Fix 1 (심각): 반품/교환 관리 — Edge Function 생성

### 문제
`supabase/functions/admin/returns/` 디렉터리가 없음.
클라이언트(`getReturns`, `approveReturn`, `rejectReturn`)가 호출하는 3개 엔드포인트가 미배포 상태 → CORS preflight 실패 → ErrorFallback 표시.

### API 경로 (axios baseURL = `functions/v1`)
| 메서드 | 경로 | 동작 |
|--------|------|------|
| GET | `/admin/returns` | 반품 목록 (status 필터 선택) |
| POST | `/admin/returns/:returnId/approve` | 반품 승인 |
| POST | `/admin/returns/:returnId/reject` | 반품 거부 |

### 수정 파일
**신규**: `supabase/functions/admin/returns/index.ts`

### 구현 내용

```ts
// 기존 패턴 참조: supabase/functions/products/index.ts
// withApiHandler: supabase/functions/_shared/withApiHandler.ts

// GET: order_returns 테이블 조인 쿼리
// - DB 컬럼명 requested_at → 클라이언트 타입 created_at 매핑 필요
// - status 파라미터로 필터링 (없으면 전체)
// - orders, order_items, products 조인

// POST approve: supabase.rpc('approve_return_request', { p_return_id })
// → 이미 migrations에 존재 (20260302000004_add_transaction_rpc.sql)

// POST reject: approve_return_request RPC 없음
// → supabase.from('order_returns').update({ status: 'rejected' }).eq('return_id', returnId)
```

### 핵심 주의사항
- `withApiHandler` 패턴 사용 (CORS 자동 처리)
- GET 쿼리에서 `requested_at` → `created_at` alias (`requested_at as created_at` 또는 select절에서 rename)
- `order_returns` 테이블의 RLS: 기존 정책은 user 기반 → service role key로 bypass

---

## Fix 2 (심각): 상품 목록 조회 항상 빈 결과

### 문제 원인 2가지

**A. API 파라미터 불일치** (`getFilteredProducts.ts`)
- 클라이언트: `period: { startDate, endDate }` (nested object)를 axios params로 전송
- Edge function: `params.get('startDate')`, `params.get('endDate')` (flat params) 기대
- axios가 nested object를 `period[startDate]=...` 형태로 직렬화 → edge function이 인식 못함

**B. dirtyFields 필터 문제** (`useSearchProducts.ts`)
- `updateFilteredProducts`가 `Object.keys(dirtyFields)`만 params에 포함
- 기본값 날짜 범위(`2025.01.01 ~ 오늘`)는 dirty 아님 → API에 미전송

### 수정 파일

1. `apps/admin/src/features/product/api/getFilteredProducts.ts`

```ts
// 변경 전
params: { search, status, category, brand, period, page }

// 변경 후: period 객체를 flat하게 스프레드
params: {
  search,
  status,
  category,
  brand,
  startDate: period?.startDate,
  endDate: period?.endDate,
  page,
}
```

2. `apps/admin/src/features/product/hooks/useSearchProducts.ts`

```ts
// 변경 전: dirtyFields만 포함
const filtered = Object.fromEntries(
  Object.keys(dirtyFields).map((key) => [key, form[key]])
);
const newParams = { ...filtered, page: 1 };

// 변경 후: 전체 form 값 사용 (기본값 포함)
const newParams = { ...form, page: 1 };
```

---

## Fix 3 (보통): 상품 등록 취소 버튼 동작 수정

### 문제
`RegisterActionButtons`의 `취소` 버튼이 `onResetClick` (form.reset()) 호출.
사용자 기대: 이전 페이지(`/products`)로 이동.

### 수정 파일
`apps/admin/src/pages/ProductRegister.tsx`

```ts
// 변경 전
onResetClick={handleReset}

// 변경 후
onResetClick={() => navigate(PATH.products)}
```

`useNavigate`는 이미 `ProductRegister.tsx`에서 import됨.

---

## Fix 4 (낮음): 대시보드 상품 통계 데이터 미구현

### 문제
`Dashboard.tsx`에서 `data: []` 하드코딩 → 판매중/품절 수치 표시 안 됨.

### 수정 파일
`apps/admin/src/pages/Dashboard.tsx`

```ts
// useProductStatusQuery 재사용 (이미 ProductStatusSummary.tsx에서 사용 중)
import { useProductStatusQuery } from '@/features/product';

// Dashboard 컴포넌트 내
const { data: productStatus } = useProductStatusQuery();

// 렌더링
const productStatistics = [
  { id: 'selling', title: '판매 중 상품', value: productStatus?.selling ?? 0 },
  { id: 'soldout', title: '품절 상품', value: productStatus?.soldout ?? 0 },
];
```

---

## 수정 파일 목록

| 우선순위 | 파일 | 변경 유형 |
|----------|------|-----------|
| 1 | `supabase/functions/admin/returns/index.ts` | **신규** |
| 2 | `apps/admin/src/features/product/api/getFilteredProducts.ts` | 수정 |
| 2 | `apps/admin/src/features/product/hooks/useSearchProducts.ts` | 수정 |
| 3 | `apps/admin/src/pages/ProductRegister.tsx` | 수정 |
| 4 | `apps/admin/src/pages/Dashboard.tsx` | 수정 |

## Verification
1. **Fix 1**: `/returns` 접근 시 ErrorFallback 없이 테이블 렌더링, 탭 필터 + 승인/거부 동작 확인
2. **Fix 2**: `/products` 조회 버튼 클릭 시 상품 목록 표시 (249개와 일치 여부)
3. **Fix 3**: 상품 등록 폼에서 취소 클릭 → `/products`로 이동
4. **Fix 4**: 대시보드 상품 통계 카드에 판매 중/품절 수치 표시
