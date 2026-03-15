# FindYourKicks Phase 2 종합 개발 실행 계획

## Context

**Phase 1 완료** (커밋: `fix: phase 1 코드 안정화`, `test: 장바구니·주문 플로우 E2E 및 단위 테스트 추가`)
- 버그 수정 (에러 stringify, console 제거, 배열 경계, HTTP status)
- 타입 안전성 강화 (`daum-postcode.d.ts`)
- Admin onError 핸들링 추가
- E2E 4개 + 단위 테스트 38개 작성 완료

**Phase 2 목표**: 타입 레벨 DDD 도입 + 3개 핵심 기능 구현
1. 검색/필터 (`/products` 페이지)
2. 주문 취소/반품/교환
3. 상품 리뷰·평점

---

## DDD 타입 전략 (신규 기능에만 적용, 소급 리팩토링 없음)

| 패턴 | 적용 범위 | 파일 위치 |
|------|----------|-----------|
| `OrderStatus` union type | 취소/반품 신규 상태 포함 | `features/order/types.ts` |
| `KRW` branded type | 신규 price 필드 | `shared/types/money.ts` |
| DTO/Domain 분리 컨벤션 | 신규 API 응답 스키마 | 각 feature `api/` 디렉토리 |

```typescript
// shared/types/money.ts
type KRW = number & { __brand: 'KRW' };
const toKRW = (n: number): KRW => n as KRW;

// features/order/types.ts
type OrderStatus =
  | 'paid' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'
  | 'cancel_requested'
  | 'return_requested' | 'return_approved' | 'returned'
  | 'exchange_requested' | 'exchange_approved' | 'shipped_again';
```

---

## 실행 계획: 7 Round omc-teams 병렬 실행

### Round 1 — DB 마이그레이션 + DDD 타입 기반 (3 workers 병렬)

**Worker 1 — Claude: DDD 타입 기반 구축**
- `apps/shop/src/shared/types/money.ts` (신규): `KRW` branded type
- `apps/shop/src/features/order/types.ts` 확장: `OrderStatus` union에 취소/반품/교환 상태 추가
- `apps/shop/src/features/product/types.ts` 확장: `ProductFilters`, `SortOption`, `FilterOptions` 타입 추가
- `apps/shop/src/features/review/types.ts` (신규): `Review`, `ReviewEligibility`, `RatingSummary`, `CreateReviewRequest` 타입

**Worker 2 — Codex: 검색/필터 + 취소/반품 DB 마이그레이션**
- `supabase/migrations/20260302000001_add_search_filter_indexes.sql`:
  - `CREATE EXTENSION IF NOT EXISTS pg_trgm`
  - `idx_products_title_trgm` (GIN), `idx_products_status_created`, `idx_products_price`
  - `product_popularity` Materialized View
  - `get_filter_options()` RPC 함수
- `supabase/migrations/20260302000002_add_cancel_return_flow.sql`:
  - `order_cancellations` 테이블 + RLS
  - `order_returns` 테이블 + RLS
  - `increase_stock(p_product_id, p_size, p_quantity)` RPC 함수

**Worker 3 — Codex: 리뷰 DB 마이그레이션**
- `supabase/migrations/20260302000003_create_product_reviews.sql`:
  - `product_reviews` 테이블 (UNIQUE(user_id, product_id), CHECK 제약)
  - RLS 4개 정책 (누구나 읽기, 인증된 사용자 쓰기/수정/삭제)
  - `product_rating_summary` 뷰 (평균, 분포)
  - `check_user_purchased_product`, `check_review_exists` RPC 함수
  - `updated_at` 트리거
- `supabase/config.toml`: `[storage.buckets.review-images]` 섹션 추가

---

### Round 2 — API Routes: 취소/반품 + 검색/필터 (2 workers 병렬)

**Worker 1 — Claude: 취소/반품 API**
- `apps/shop/src/app/api/orders/[orderId]/cancel/route.ts` (신규):
  - 주문 소유권 확인 → `status === 'paid' || 'preparing'` 검증
  - Toss Payments `POST /v1/payments/{paymentKey}/cancel` 호출
  - 성공 시: `orders.status = 'cancelled'`, `order_cancellations` INSERT, `increase_stock` RPC 호출
- `apps/shop/src/app/api/orders/[orderId]/return/route.ts` (신규):
  - `status === 'delivered'` + 7일 이내 검증
  - `order_returns` INSERT, `orders.status = 'return_requested'|'exchange_requested'`
- `apps/shop/src/app/api/orders/[orderId]/route.ts` 확장:
  - `cancellationInfo`, `returnInfo` 필드 응답에 추가

**Worker 2 — Claude: 검색/필터 API**
- `apps/shop/src/app/api/products/route.ts` 확장:
  - `q` (ILIKE title+brand), `brand[]`, `category[]`, `size[]`, `minPrice`, `maxPrice`, `sort` 파라미터
  - 사이즈 필터: inventory 서브쿼리 선조회 후 `product_id IN [...]`
  - 정렬: `latest|price_asc|price_desc|popular`
- `apps/shop/src/app/api/products/filters/route.ts` (신규):
  - `supabase.rpc('get_filter_options')` 호출
  - 브랜드/카테고리/사이즈 목록 반환

---

### Round 3 — API Routes: 리뷰 (1 worker)

**Worker 1 — Claude: 리뷰 API 전체**
- `apps/shop/src/app/api/products/[id]/reviews/route.ts` (신규):
  - `GET`: cursor 기반 무한 스크롤 (offset 아님 — 실시간 추가/삭제 고려)
  - `POST`: `check_user_purchased_product` → `check_review_exists` → INSERT → 201
- `apps/shop/src/app/api/products/[id]/reviews/eligibility/route.ts` (신규):
  - `{ canReview: boolean, reason?: 'NOT_PURCHASED' | 'ALREADY_REVIEWED' }`
- `apps/shop/src/app/api/reviews/[reviewId]/route.ts` (신규):
  - `PATCH`: 리뷰 수정 (RLS로 본인만)
  - `DELETE`: 리뷰 삭제 + Storage 이미지 삭제
- `apps/shop/src/app/api/reviews/upload/route.ts` (신규):
  - `FormData` → Supabase Storage `review-images/{userId}/{productId}/{timestamp}.webp`
- `apps/shop/src/app/api/products/[id]/route.ts` 확장:
  - `product_rating_summary` 뷰 조인 → `rating: RatingSummary` 응답 추가

---

### Round 4 — Frontend 인프라: 검색/필터 + 취소/반품 (2 workers 병렬)

**Worker 1 — Claude: 검색/필터 Frontend Infra**
- `features/product/actions.ts` 변경:
  - `fetchProducts()`: Supabase RPC 직접호출 → `/api/products` Route 통일
  - `fetchFilterOptions()` 신규 추가
- `features/product/hooks/queries/productQueries.ts` 변경:
  - `list(filters?: ProductFilters)` — queryKey에 filters 포함
  - `filterOptions()` 쿼리 추가 (5분 staleTime)
- `features/product/hooks/queries/useProductsQuery.ts` 변경: filters 파라미터 전달
- `features/product/hooks/useProductFilters.ts` (신규):
  - URL searchParams ↔ ProductFilters 양방향 동기화
  - `setFilters`, `clearFilters`, `activeFilterCount` 반환
- `features/product/hooks/useProductList.ts` 변경: `useProductFilters` 통합

**Worker 2 — Claude: 취소/반품 Frontend Infra**
- `features/order/hooks/mutations/useCancelOrderMutation.ts` (신규):
  - `POST /api/orders/[orderId]/cancel`
  - onSuccess: `orderQueries` invalidate
- `features/order/hooks/mutations/useReturnOrderMutation.ts` (신규):
  - `POST /api/orders/[orderId]/return`
  - onSuccess: `orderQueries` invalidate
- `features/order/types.ts`: `OrderStatus` 확장 (취소/반품/교환 상태 추가)
- `features/order/api/getOrderById.ts`: Zod 스키마 확장 (cancellationInfo, returnInfo)

---

### Round 5 — Frontend 인프라: 리뷰 (1 worker)

**Worker 1 — Claude: 리뷰 Feature 전체**
- `features/review/` 디렉토리 전체 생성:
  - `types.ts` (Review, ReviewEligibility, RatingSummary, 요청/응답 타입)
  - `api/`: fetchReviews (Zod 검증 포함), createReview, updateReview, deleteReview, uploadReviewImages, checkReviewEligibility
  - `hooks/queries/reviewQueries.ts`: 쿼리 키 팩토리
  - `hooks/queries/useProductReviewsQuery.ts`: `useSuspenseInfiniteQuery` (cursor 기반)
  - `hooks/mutations/`: useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation
  - onSuccess: 리뷰 목록 + eligibility + product 쿼리 invalidate
- `features/product/types.ts`: `ProductDetail`에 `rating: RatingSummary` 추가
- `shared/constants/apiEndpoints.ts`: `reviews`, `reviewUpload` 엔드포인트 추가

---

### Round 6 — UI 컴포넌트 전체 (3 workers 병렬)

**Worker 1 — Claude: 검색/필터 UI**
- `features/product/components/SearchBar.tsx` + scss (300ms 디바운스)
- `features/product/components/FilterPanel.tsx` + scss (데스크탑 사이드바)
- `features/product/components/SortSelect.tsx` + scss
- `features/product/components/FilterChips.tsx` + scss (활성 필터 태그)
- `features/product/components/MobileFilterDrawer.tsx` + scss (Bottom Sheet, GlobalPortal 활용)
- `features/product/components/ProductSearchPage.tsx` + scss (통합 컴포넌트)
- `app/(shop)/products/page.tsx` (신규), `loading.tsx` (신규)
- `app/_layouts/header/Header.tsx`: 검색 아이콘/링크 추가

**Worker 2 — Claude: 취소/반품 UI**
- `features/order/components/CancelRequestModal.tsx` (사유 입력 + useCancelOrderMutation)
- `features/order/components/ReturnRequestForm.tsx` (반품/교환 타입 + 사유 입력 + useReturnOrderMutation)
- `features/order/components/OrderDetail.tsx` 변경:
  - `STATUS_MAP` 확장 (취소/반품/교환 상태 텍스트)
  - 조건부 버튼 렌더링 (`paid|preparing` → 취소, `delivered` + 7일 이내 → 반품/교환)
- `features/order/components/OrderHistoryList.tsx` 변경: 신규 상태 텍스트 표시

**Worker 3 — Claude: 리뷰 UI**
- `features/review/components/StarRating.tsx` + scss (읽기전용/입력 두 모드, 소수점 지원)
- `features/review/components/RatingDistribution.tsx` + scss
- `features/review/components/RatingSummary.tsx` + scss
- `features/review/components/ReviewCard.tsx` + scss
- `features/review/components/ReviewList.tsx` + scss (무한 스크롤)
- `features/review/components/ReviewImageUpload.tsx` + scss (최대 3장)
- `features/review/components/ReviewForm.tsx` + scss (별점 + 텍스트 + 이미지)
- `features/review/components/ReviewWriteButton.tsx` + scss (eligibility 검증 후 표시)
- `app/(shop)/product/[id]/page.tsx` 변경: `<ReviewSection>` 추가
- `features/product/components/Description.tsx` 변경: 평균 별점 표시

---

### Round 7 — 통합 테스트 + Admin + 전체 코드 리뷰 (3 workers 병렬)

**Worker 1 — Claude: E2E 통합 테스트**
- `apps/shop/src/tests/search-filter.test.ts`: 검색어 입력 → 결과 필터링 → URL 공유
- `apps/shop/src/tests/order-cancel.test.ts`: 주문 상세 → 취소 버튼 → 확인 모달 → API 호출
- `apps/shop/src/tests/review.test.ts`: 상품 상세 → 리뷰 섹션 표시 → 작성 모달 (인증 필요)

**Worker 2 — Codex: Admin 취소/반품 관리 + 린트 수정**
- `apps/shop/src/app/api/admin/returns/route.ts` (신규): 반품/교환 요청 목록
- `apps/shop/src/app/api/admin/returns/[returnId]/approve/route.ts` (신규): 승인 처리
- `apps/shop/src/app/api/admin/returns/[returnId]/reject/route.ts` (신규): 거부 처리
- Admin React 페이지: 반품/교환 요청 목록 + 상태 처리 UI
- `pnpm biome lint` 후 발생하는 `useNodejsImportProtocol` 등 린트 오류 수정

**Worker 3 — Gemini: 전체 코드 리뷰**
- Round 1~6 변경사항 전체 검토
- 타입 안전성, 에러 처리 누락 확인
- RLS 정책 보안 검토
- DDD 타입 패턴 일관성 확인
- 개선 필요 사항 보고서 작성 → 발견된 이슈는 별도 커밋으로 수정

---

## 핵심 파일 경로 (Phase 2 대상)

### 신규 파일
```
supabase/migrations/20260302000001_add_search_filter_indexes.sql
supabase/migrations/20260302000002_add_cancel_return_flow.sql
supabase/migrations/20260302000003_create_product_reviews.sql
apps/shop/src/shared/types/money.ts
apps/shop/src/app/api/products/filters/route.ts
apps/shop/src/app/api/orders/[orderId]/cancel/route.ts
apps/shop/src/app/api/orders/[orderId]/return/route.ts
apps/shop/src/app/api/products/[id]/reviews/route.ts
apps/shop/src/app/api/products/[id]/reviews/eligibility/route.ts
apps/shop/src/app/api/reviews/[reviewId]/route.ts
apps/shop/src/app/api/reviews/upload/route.ts
apps/shop/src/features/product/hooks/useProductFilters.ts
apps/shop/src/features/order/hooks/mutations/useCancelOrderMutation.ts
apps/shop/src/features/order/hooks/mutations/useReturnOrderMutation.ts
apps/shop/src/features/review/                        (feature 전체)
apps/shop/src/app/(shop)/products/page.tsx
```

### 수정 파일
```
apps/shop/src/app/api/products/route.ts               (검색/필터 확장)
apps/shop/src/app/api/products/[id]/route.ts          (평점 추가)
apps/shop/src/app/api/orders/[orderId]/route.ts       (취소/반품 정보 추가)
apps/shop/src/features/product/types.ts               (ProductFilters 등)
apps/shop/src/features/product/actions.ts             (RPC → API Route)
apps/shop/src/features/product/hooks/queries/productQueries.ts
apps/shop/src/features/product/hooks/queries/useProductsQuery.ts
apps/shop/src/features/product/hooks/useProductList.ts
apps/shop/src/features/order/types.ts                 (OrderStatus 확장)
apps/shop/src/features/order/api/getOrderById.ts      (Zod 스키마 확장)
apps/shop/src/features/order/components/OrderDetail.tsx
apps/shop/src/shared/constants/apiEndpoints.ts        (reviews 엔드포인트)
apps/shop/src/app/_layouts/header/Header.tsx          (검색 진입점)
supabase/config.toml                                  (review-images 버킷)
```

---

## 검증 방법

1. `pnpm turbo run lint` — Biome 린트 통과
2. `pnpm turbo run build` — 빌드 오류 없음
3. TypeScript strict: `tsc --noEmit`
4. E2E:
   - 검색어 입력 → URL 파라미터 반영 → 결과 필터링 확인
   - 결제 완료 주문 → 취소 버튼 표시 → 취소 API 호출 성공 확인
   - 상품 상세 → 리뷰 섹션 표시 → 작성 버튼 자격 검증 확인
5. DB 마이그레이션: Supabase 대시보드에서 테이블/뷰/RPC 생성 확인
6. Gemini 코드 리뷰 보고서 이슈 0건 또는 수정 완료

---

## Supabase MCP 사용 방침

- **우선 방법**: 마이그레이션 SQL 파일 작성 → 개발자가 Supabase 대시보드에서 직접 실행
- **차선 방법**: `supabase` CLI (`supabase db push`, `supabase migration new`)
- **최후 수단**: Supabase MCP — 위 두 방법으로 해결 불가능한 경우에만 사용

---

## 주의사항

- `actions.ts`의 Supabase RPC 직접 호출을 API Route로 변경 시 홈페이지(`/`) SSR prefetch 로직도 함께 수정 필요
- Toss Payments 취소 API는 `TOSS_SECRET_KEY` 환경 변수 필요 (기존 결제 플로우와 동일 키 사용)
- 리뷰 이미지 업로드: webp 변환을 위해 `sharp` 패키지 설치 여부 확인 (`apps/shop/package.json`)
- Admin 반품/교환 API는 인증 미들웨어 필요 (기존 `/api/admin` 라우트 패턴 확인 후 동일 적용)
- Round별 완료 후 `git commit` — Round 1, 2+3, 4+5, 6, 7 총 5개 커밋으로 분리
