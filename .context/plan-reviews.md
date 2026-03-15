# FindYourKicks 상품 리뷰/평점 시스템 설계 문서

> 작성일: 2026-03-02
> 기반 분석: 기존 코드베이스 전체 분석 완료

---

## 1. 기능 범위

### 1.1 핵심 기능

| 기능 | 설명 | 제약조건 |
|------|------|----------|
| 리뷰 작성 자격 | 해당 상품을 주문 완료(status: `paid` 이상)한 사용자만 | `orders` + `order_items` 테이블 조인으로 검증 |
| 별점 선택 | 1~5점 정수 선택 (필수) | `CHECK (rating >= 1 AND rating <= 5)` |
| 텍스트 리뷰 | 선택적 입력, 비워둘 수 있음 | 최대 1000자, `nullable` |
| 사진 첨부 | 선택적, 최대 3장 | Supabase Storage `review-images` 버킷 |
| 수정/삭제 | 본인 리뷰만 가능 | RLS 정책으로 `user_id = auth.uid()` 검증 |
| 중복 방지 | 동일 사용자 + 동일 상품에 대해 1회만 작성 | `UNIQUE(user_id, product_id)` 제약 |
| 상품 상세 표시 | 평균 평점, 평점 분포, 리뷰 목록 | DB 뷰 + 무한 스크롤 |

### 1.2 리뷰 작성 진입점

1. **주문 상세 페이지** (`/my/orders/[orderId]`): 각 상품 옆에 "리뷰 작성" 버튼
2. **상품 상세 페이지** (`/product/[id]`): 리뷰 섹션 하단 "리뷰 작성" 버튼 (주문 이력 있는 경우만 노출)

---

## 2. DB 변경사항

### 2.1 기존 테이블 구조 (코드에서 추론)

기존 코드에서 사용하는 테이블:
- `products` (product_id, title, price, image, description, brand_id, category_id)
- `orders` (order_id, user_id, order_sheet_id, address_id, total_amount, status, order_date, tracking_number)
- `order_items` (order_item_id, order_id, product_id, size, quantity, price)
- `auth.users` (Supabase Auth 기본 - id를 user_id로 사용)

### 2.2 신규 테이블: `product_reviews`

```sql
-- 마이그레이션 파일: supabase/migrations/20260302000001_create_product_reviews.sql

-- 1. product_reviews 테이블 생성
CREATE TABLE public.product_reviews (
  review_id     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content       TEXT,                          -- 선택적 텍스트 리뷰 (최대 1000자)
  image_urls    TEXT[] DEFAULT '{}',           -- 사진 URL 배열 (최대 3장)
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- 동일 사용자 + 동일 상품 중복 리뷰 방지
  CONSTRAINT uq_user_product_review UNIQUE (user_id, product_id),
  -- 텍스트 길이 제한
  CONSTRAINT chk_content_length CHECK (content IS NULL OR char_length(content) <= 1000),
  -- 이미지 개수 제한
  CONSTRAINT chk_image_count CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 3)
);

-- 2. 인덱스
CREATE INDEX idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX idx_reviews_created_at ON public.product_reviews(created_at DESC);
CREATE INDEX idx_reviews_product_rating ON public.product_reviews(product_id, rating);

-- 3. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS(Row Level Security) 정책
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 누구나 리뷰 조회 가능
CREATE POLICY "reviews_select_all"
  ON public.product_reviews
  FOR SELECT
  USING (true);

-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "reviews_insert_auth"
  ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 수정 가능
CREATE POLICY "reviews_update_own"
  ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 삭제 가능
CREATE POLICY "reviews_delete_own"
  ON public.product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 2.3 평점 집계 뷰

```sql
-- 상품별 평점 통계 뷰
CREATE OR REPLACE VIEW public.product_rating_summary AS
SELECT
  product_id,
  COUNT(*)::INT AS review_count,
  ROUND(AVG(rating)::NUMERIC, 1) AS average_rating,
  COUNT(*) FILTER (WHERE rating = 1)::INT AS rating_1,
  COUNT(*) FILTER (WHERE rating = 2)::INT AS rating_2,
  COUNT(*) FILTER (WHERE rating = 3)::INT AS rating_3,
  COUNT(*) FILTER (WHERE rating = 4)::INT AS rating_4,
  COUNT(*) FILTER (WHERE rating = 5)::INT AS rating_5
FROM public.product_reviews
GROUP BY product_id;
```

### 2.4 주문 완료 검증 RPC 함수

```sql
-- 사용자가 해당 상품을 구매했는지 확인하는 RPC 함수
CREATE OR REPLACE FUNCTION public.check_user_purchased_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id
      AND o.status IN ('paid', 'preparing', 'shipping', 'delivered')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

> 참고: `orders.status` 값은 기존 `OrderDetail.tsx:14-19`의 `STATUS_MAP`에서 확인됨: `paid`, `preparing`, `shipping`, `delivered`, `cancelled`

### 2.5 사용자의 특정 상품 리뷰 존재 여부 확인 RPC

```sql
-- 이미 리뷰를 작성했는지 확인
CREATE OR REPLACE FUNCTION public.check_review_exists(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.product_reviews
    WHERE user_id = p_user_id
      AND product_id = p_product_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.6 Supabase Storage 버킷 설정

`supabase/config.toml`에 추가 (기존 `[storage.buckets.products]` 패턴과 동일):

```toml
[storage.buckets.review-images]
public = true
file_size_limit = "5MiB"
allowed_mime_types = ["image/png", "image/jpeg", "image/webp"]
```

> 근거: 기존 `config.toml:77-80`의 `[storage.buckets.products]` 설정 패턴을 따름.
> 리뷰 이미지는 상품 이미지(50MiB)보다 작은 5MiB로 제한.

Storage RLS 정책:
```sql
-- review-images 버킷 정책
-- 누구나 읽기 가능
CREATE POLICY "review_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

-- 인증된 사용자만 업로드 가능 (본인 폴더에만)
CREATE POLICY "review_images_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- 본인 이미지만 삭제 가능
CREATE POLICY "review_images_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'review-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );
```

이미지 저장 경로 규칙: `review-images/{user_id}/{product_id}/{timestamp}.webp`

---

## 3. API 설계

### 3.1 기존 API 패턴 분석

기존 코드베이스의 API 패턴:
- **서버**: Next.js App Router API Routes (`apps/shop/src/app/api/`)
- **인증**: `createClient()` (서버 Supabase) + `supabase.auth.getUser()` 패턴 (참조: `orders/route.ts:33-47`)
- **응답**: `NextResponse.json()` with 적절한 status code
- **클라이언트**: `api` 유틸리티 (`shared/utils/api.ts`) - `NEXT_PUBLIC_API_URL/api` prefix, `credentials: 'include'`
- **검증**: Zod 스키마 (`features/order/api/fetchOrderHistory.ts:5-26` 패턴)

### 3.2 리뷰 목록 조회

```
GET /api/products/[id]/reviews?cursor={lastReviewId}&limit=10
```

**파일**: `apps/shop/src/app/api/products/[id]/reviews/route.ts` (신규)

| 항목 | 내용 |
|------|------|
| 인증 | 불필요 (공개 조회) |
| 쿼리 파라미터 | `cursor` (커서 기반 무한 스크롤), `limit` (기본 10) |
| 정렬 | `created_at DESC` |
| 응답 필드 | `reviews[]`, `nextCursor`, `hasNext` |

응답 예시:
```json
{
  "reviews": [
    {
      "reviewId": "uuid",
      "userId": "uuid",
      "productId": "uuid",
      "rating": 5,
      "content": "편하고 좋아요",
      "imageUrls": ["https://..."],
      "createdAt": "2026-03-01T...",
      "updatedAt": "2026-03-01T..."
    }
  ],
  "nextCursor": "uuid-of-last-review",
  "hasNext": true
}
```

구현 핵심:
```typescript
// cursor 기반 페이지네이션 (기존 productQueries.ts의 offset 기반과 다름)
let query = supabase
  .from('product_reviews')
  .select('*')
  .eq('product_id', id)
  .order('created_at', { ascending: false })
  .limit(limit + 1); // 다음 페이지 존재 여부 확인용 +1

if (cursor) {
  const { data: cursorReview } = await supabase
    .from('product_reviews')
    .select('created_at')
    .eq('review_id', cursor)
    .single();
  query = query.lt('created_at', cursorReview.created_at);
}
```

> offset 대신 cursor 방식을 선택한 이유: 리뷰 목록은 실시간으로 추가/삭제되므로 offset 방식은 중복/누락이 발생할 수 있음. 기존 `productQueries.ts:11-13`의 offset 기반 무한 스크롤과 다르지만, 리뷰 데이터 특성상 cursor가 더 적합함.

### 3.3 리뷰 작성

```
POST /api/products/[id]/reviews
```

**파일**: `apps/shop/src/app/api/products/[id]/reviews/route.ts` (위 파일에 POST 추가)

| 항목 | 내용 |
|------|------|
| 인증 | 필수 - `supabase.auth.getUser()` |
| 요청 Body | `{ rating: number, content?: string, imageUrls?: string[] }` |
| 검증 1 | 주문 완료 여부: `check_user_purchased_product` RPC |
| 검증 2 | 중복 리뷰 여부: `UNIQUE` 제약조건이 DB 레벨에서 방어, API에서도 사전 체크 |
| 응답 | `201` + 생성된 리뷰 객체 |

검증 흐름:
```
1. auth.getUser() -> user_id 획득
2. check_user_purchased_product(user_id, product_id) -> false면 403
3. check_review_exists(user_id, product_id) -> true면 409 (중복)
4. product_reviews INSERT
5. 201 응답
```

### 3.4 리뷰 수정

```
PATCH /api/reviews/[reviewId]
```

**파일**: `apps/shop/src/app/api/reviews/[reviewId]/route.ts` (신규)

| 항목 | 내용 |
|------|------|
| 인증 | 필수 |
| 요청 Body | `{ rating?: number, content?: string, imageUrls?: string[] }` |
| 권한 검증 | RLS가 `auth.uid() = user_id`를 강제하지만, API에서도 명시적 체크 |
| 응답 | `200` + 수정된 리뷰 객체 |

### 3.5 리뷰 삭제

```
DELETE /api/reviews/[reviewId]
```

**파일**: `apps/shop/src/app/api/reviews/[reviewId]/route.ts` (위 파일에 DELETE 추가)

| 항목 | 내용 |
|------|------|
| 인증 | 필수 |
| 부가 작업 | Storage에서 해당 리뷰 이미지 삭제 |
| 응답 | `200` + `{ message: '리뷰가 삭제되었습니다' }` |

### 3.6 리뷰 이미지 업로드

```
POST /api/reviews/upload
```

**파일**: `apps/shop/src/app/api/reviews/upload/route.ts` (신규)

| 항목 | 내용 |
|------|------|
| 인증 | 필수 |
| 요청 | `FormData` (multipart/form-data) |
| 처리 | webp 변환 후 `review-images/{userId}/{productId}/{timestamp}.webp` 업로드 |
| 응답 | `{ urls: string[] }` |

> 참고: 기존 `supabase/functions/image-upload/index.ts`가 Supabase Edge Function으로 상품 이미지 업로드를 처리하지만, 리뷰 이미지는 Next.js API Route에서 직접 Supabase Storage SDK를 사용하는 방식이 클라이언트 코드 일관성 면에서 적합.

### 3.7 GET /api/products/[id] 확장

기존 `apps/shop/src/app/api/products/[id]/route.ts`의 응답에 평점 정보 추가:

```typescript
// 기존 flatProduct 객체에 추가
const { data: ratingSummary } = await supabase
  .from('product_rating_summary')  // 위에서 생성한 뷰
  .select('*')
  .eq('product_id', id)
  .maybeSingle();

const flatProduct = {
  // ... 기존 필드 (productId, title, price, image, description, brand, category, inventory)
  rating: {
    average: ratingSummary?.average_rating ?? 0,
    count: ratingSummary?.review_count ?? 0,
    distribution: {
      1: ratingSummary?.rating_1 ?? 0,
      2: ratingSummary?.rating_2 ?? 0,
      3: ratingSummary?.rating_3 ?? 0,
      4: ratingSummary?.rating_4 ?? 0,
      5: ratingSummary?.rating_5 ?? 0,
    },
  },
};
```

### 3.8 주문 완료 검증 API (프론트 편의용)

```
GET /api/products/[id]/reviews/eligibility
```

**파일**: `apps/shop/src/app/api/products/[id]/reviews/eligibility/route.ts` (신규)

| 항목 | 내용 |
|------|------|
| 인증 | 필수 |
| 응답 | `{ canReview: boolean, reason?: string }` |

`canReview`가 `false`인 경우의 `reason`:
- `"NOT_PURCHASED"`: 구매 이력 없음
- `"ALREADY_REVIEWED"`: 이미 리뷰 작성함

---

## 4. 프론트엔드 설계

### 4.1 Feature 디렉토리 결정: `features/review/` 독립 모듈

**결정 근거**: 기존 feature 디렉토리 구조(`cart`, `order`, `product`, `user` 등)가 도메인 단위로 분리되어 있음. 리뷰는 product에 표시되지만 order와도 연관되므로, 독립 feature로 분리하는 것이 결합도를 낮추고 기존 패턴과 일관성 있음.

```
apps/shop/src/features/review/
├── index.ts                         # barrel export
├── types.ts                         # Review, ReviewEligibility, RatingSummary 타입
├── api/
│   ├── index.ts
│   ├── fetchReviews.ts              # GET /api/products/[id]/reviews
│   ├── createReview.ts              # POST /api/products/[id]/reviews
│   ├── updateReview.ts              # PATCH /api/reviews/[reviewId]
│   ├── deleteReview.ts              # DELETE /api/reviews/[reviewId]
│   ├── uploadReviewImages.ts        # POST /api/reviews/upload
│   └── checkReviewEligibility.ts    # GET /api/products/[id]/reviews/eligibility
├── hooks/
│   ├── index.ts
│   ├── queries/
│   │   ├── index.ts
│   │   ├── reviewQueries.ts         # query key factory
│   │   └── useProductReviewsQuery.ts  # useSuspenseInfiniteQuery
│   └── mutations/
│       ├── useCreateReviewMutation.ts
│       ├── useUpdateReviewMutation.ts
│       └── useDeleteReviewMutation.ts
└── components/
    ├── index.ts
    ├── StarRating.tsx               # 별점 (읽기전용 + 입력용)
    ├── StarRating.module.scss
    ├── RatingDistribution.tsx       # 평점 분포 바 차트
    ├── RatingDistribution.module.scss
    ├── RatingSummary.tsx             # 평균 평점 + 분포 통합 섹션
    ├── RatingSummary.module.scss
    ├── ReviewCard.tsx               # 개별 리뷰 카드
    ├── ReviewCard.module.scss
    ├── ReviewList.tsx               # 무한 스크롤 리뷰 목록
    ├── ReviewList.module.scss
    ├── ReviewForm.tsx               # 리뷰 작성/수정 폼
    ├── ReviewForm.module.scss
    ├── ReviewImageUpload.tsx        # 이미지 첨부 UI
    ├── ReviewImageUpload.module.scss
    ├── ReviewWriteButton.tsx        # "리뷰 작성" 버튼 (자격 검증 포함)
    └── ReviewWriteButton.module.scss
```

### 4.2 타입 정의

```typescript
// features/review/types.ts

export interface Review {
  reviewId: string;
  userId: string;
  productId: string;
  rating: number;         // 1~5
  content: string | null;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: 'NOT_PURCHASED' | 'ALREADY_REVIEWED';
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CreateReviewRequest {
  rating: number;
  content?: string;
  imageUrls?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
  imageUrls?: string[];
}
```

기존 `ProductDetail` 타입 확장 (`features/product/types.ts:1-10`):

```typescript
// features/product/types.ts 에 추가
export interface ProductDetail {
  // ... 기존 필드
  rating: RatingSummary;  // 추가
}
```

> `RatingSummary`는 `features/review/types.ts`에서 import. product -> review 단방향 의존만 허용.

### 4.3 API 함수 (Zod 검증 패턴 적용)

기존 `fetchOrderHistory.ts:5-28`의 Zod 스키마 + `api.get()` 패턴을 따름:

```typescript
// features/review/api/fetchReviews.ts
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const reviewSchema = z.object({
  reviewId: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const reviewsResponseSchema = z.object({
  reviews: z.array(reviewSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
});

export const fetchReviews = async (productId: string, cursor?: string) => {
  const params = new URLSearchParams({ limit: '10' });
  if (cursor) params.set('cursor', cursor);

  return await api
    .get<z.infer<typeof reviewsResponseSchema>>(
      `${ENDPOINTS.products}/${productId}/reviews?${params}`
    )
    .then((res) => reviewsResponseSchema.parse(res));
};
```

```typescript
// features/review/api/createReview.ts
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import type { CreateReviewRequest } from '../types';

export const createReview = async (productId: string, body: CreateReviewRequest) => {
  return await api.post<{ reviewId: string }, CreateReviewRequest>(
    `${ENDPOINTS.products}/${productId}/reviews`,
    body
  );
};
```

### 4.4 TanStack Query 훅

기존 패턴 분석:
- **Query Key Factory**: `productQueries` (`features/product/hooks/queries/productQueries.ts:4-17`)
- **Infinite Query**: `useSuspenseInfiniteQuery` + `infiniteQueryOptions` (`productQueries.ts:7-16`)
- **Mutation**: `useMutation` + `queryClient.invalidateQueries` (`features/cart/hooks/mutations/useCartItemMutation.ts:4-14`)

```typescript
// features/review/hooks/queries/reviewQueries.ts
import { fetchReviews } from '@/features/review/api';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

export const reviewQueries = {
  all: () => ['review'] as const,

  list: (productId: string) =>
    infiniteQueryOptions({
      queryKey: [...reviewQueries.all(), 'list', productId] as const,
      queryFn: ({ pageParam }) => fetchReviews(productId, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      refetchOnWindowFocus: false,
    }),

  eligibility: (productId: string) =>
    queryOptions({
      queryKey: [...reviewQueries.all(), 'eligibility', productId] as const,
      queryFn: () => checkReviewEligibility(productId),
      refetchOnWindowFocus: false,
    }),
};
```

```typescript
// features/review/hooks/queries/useProductReviewsQuery.ts
import { reviewQueries } from './reviewQueries';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function useProductReviewsQuery(productId: string) {
  return useSuspenseInfiniteQuery(reviewQueries.list(productId));
}
```

```typescript
// features/review/hooks/mutations/useCreateReviewMutation.ts
import { createReview } from '@/features/review/api';
import { reviewQueries } from '@/features/review/hooks/queries/reviewQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateReviewRequest } from '../../types';

export function useCreateReviewMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateReviewRequest) => createReview(productId, body),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: reviewQueries.list(productId).queryKey,
      });
      // 작성 자격 갱신 (이미 작성됨으로 변경)
      queryClient.invalidateQueries({
        queryKey: reviewQueries.eligibility(productId).queryKey,
      });
      // 상품 상세의 평점 정보 갱신 (product query key)
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
    },
  });
}
```

```typescript
// features/review/hooks/mutations/useDeleteReviewMutation.ts
import { deleteReview } from '@/features/review/api';
import { reviewQueries } from '@/features/review/hooks/queries/reviewQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteReviewMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewQueries.list(productId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: reviewQueries.eligibility(productId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
    },
  });
}
```

### 4.5 컴포넌트 설계

#### StarRating 컴포넌트

두 가지 모드 지원: 읽기전용(표시), 입력용(선택)

```typescript
// features/review/components/StarRating.tsx
interface StarRatingProps {
  value: number;               // 현재 별점 값 (1~5 또는 소수점)
  onChange?: (value: number) => void;  // 있으면 입력 모드, 없으면 읽기전용
  size?: 'sm' | 'md' | 'lg';
}
```

- 읽기전용: `onChange` 미전달, 소수점 지원 (평균 평점 표시용), 부분 채움 star
- 입력용: `onChange` 전달, 정수만 (1~5), hover 효과, 클릭으로 선택

#### 상품 상세 페이지 UI 변경

기존 `apps/shop/src/app/(shop)/product/[id]/page.tsx:7-33`의 구조:

```
<article>
  <figure>  ProductImage  </figure>
  <divider />
  <DetailContent />
  <!-- 여기에 리뷰 섹션 추가 -->
  <ReviewSection productId={id} />   <!-- 신규 -->
</article>
```

`ReviewSection`은 다음을 포함:
1. `RatingSummary` - 평균 평점 + 평점 분포 바
2. `ReviewWriteButton` - 자격 검증 후 리뷰 작성 버튼 표시
3. `ReviewList` - 무한 스크롤 리뷰 카드 목록

#### Description 컴포넌트 확장

기존 `Description.tsx:3-35`의 상품 정보 표시 영역에 평균 별점 표시 추가:

```
브랜드명
999,999 원
★ 4.3 (128개 리뷰)    <-- 추가
상품명
브랜드 > 카테고리
상품 설명
```

#### ReviewForm (모달/바텀시트)

```typescript
interface ReviewFormProps {
  productId: string;
  existingReview?: Review;      // 수정 모드일 때
  onClose: () => void;
}
```

구성:
1. 별점 선택 (StarRating, 입력 모드)
2. 텍스트 입력 (textarea, placeholder: "리뷰를 작성해주세요 (선택)")
3. 이미지 업로드 (ReviewImageUpload, 최대 3장)
4. 제출 버튼

#### 주문 이력 페이지 변경

기존 `OrderProduct.tsx:10-25`에 리뷰 작성 버튼 추가:

```typescript
// OrderProduct 컴포넌트 확장 - type="order"일 때 리뷰 작성 버튼 조건부 렌더링
// 조건: 해당 상품에 대한 리뷰가 아직 없는 경우
<OrderProduct product={product} type="order" />
// 아래에 ReviewWriteButton 렌더링
```

`OrderDetail.tsx:65-78`의 `OrderProducts` 섹션에서 각 상품 옆에 "리뷰 작성" 버튼 노출.

### 4.6 ENDPOINTS 상수 추가

`shared/constants/apiEndpoints.ts:7-15`에 추가:

```typescript
export const ENDPOINTS = {
  // ... 기존
  reviews: '/reviews',              // PATCH/DELETE 용
  reviewUpload: '/reviews/upload',  // 이미지 업로드
} as const;
```

> 리뷰 목록/작성(`/products/[id]/reviews`)은 기존 `ENDPOINTS.products`를 조합하여 사용.

### 4.7 PATH 상수 추가

`shared/constants/path.ts:5-15`에 추가 불필요: 리뷰 작성은 모달/바텀시트로 처리하므로 별도 페이지 라우트 불필요.

---

## 5. 구현 순서 (단계별 의존성 고려)

### Phase 1: DB + Storage 기반 (모든 것의 기초)

1. **마이그레이션 파일 작성 및 적용**
   - `product_reviews` 테이블 생성
   - RLS 정책 설정
   - `product_rating_summary` 뷰 생성
   - `check_user_purchased_product`, `check_review_exists` RPC 함수
   - `updated_at` 트리거

2. **Supabase Storage 버킷 설정**
   - `config.toml`에 `review-images` 버킷 추가
   - Storage RLS 정책 적용

### Phase 2: API 엔드포인트 (프론트엔드의 전제조건)

3. **이미지 업로드 API** (`POST /api/reviews/upload`)
   - 다른 API가 `imageUrls`를 받아야 하므로 먼저 구현

4. **리뷰 작성 API** (`POST /api/products/[id]/reviews`)
   - 주문 완료 검증 + 중복 체크 + INSERT

5. **리뷰 목록 조회 API** (`GET /api/products/[id]/reviews`)
   - 커서 기반 페이지네이션

6. **자격 검증 API** (`GET /api/products/[id]/reviews/eligibility`)

7. **리뷰 수정/삭제 API** (`PATCH/DELETE /api/reviews/[reviewId]`)

8. **상품 상세 API 확장** (`GET /api/products/[id]`)
   - `product_rating_summary` 뷰 조인하여 평점 정보 포함

### Phase 3: 프론트엔드 기반 인프라

9. **타입 정의** (`features/review/types.ts`)

10. **API 함수** (`features/review/api/`)
    - Zod 스키마 + `api` 유틸리티 사용

11. **TanStack Query 훅** (`features/review/hooks/`)
    - `reviewQueries`, `useProductReviewsQuery`, mutation 훅들

12. **`ProductDetail` 타입 확장** (`features/product/types.ts`)
    - `rating: RatingSummary` 필드 추가

### Phase 4: UI 컴포넌트 (상향식)

13. **StarRating 컴포넌트** (재사용 가능한 기본 단위)

14. **ReviewCard 컴포넌트** (개별 리뷰 표시)

15. **ReviewImageUpload 컴포넌트** (이미지 첨부 UI)

16. **ReviewForm 컴포넌트** (별점 + 텍스트 + 이미지)

17. **RatingDistribution + RatingSummary** (평점 통계 표시)

18. **ReviewList** (무한 스크롤 + ReviewCard)

19. **ReviewWriteButton** (자격 검증 + 폼 모달 트리거)

### Phase 5: 페이지 통합

20. **상품 상세 페이지에 ReviewSection 통합**
    - `page.tsx` 수정 + `Description.tsx`에 평균 평점 추가

21. **주문 상세 페이지에 리뷰 작성 버튼 추가**
    - `OrderDetail.tsx` / `OrderProduct.tsx` 수정

22. **ENDPOINTS 상수 업데이트**

---

## 6. 예상 파일 변경 목록

### 신규 파일 (22개)

| 파일 경로 | 목적 |
|-----------|------|
| `supabase/migrations/20260302000001_create_product_reviews.sql` | 테이블, RLS, 뷰, RPC, 트리거 |
| `apps/shop/src/app/api/products/[id]/reviews/route.ts` | GET(목록) + POST(작성) |
| `apps/shop/src/app/api/products/[id]/reviews/eligibility/route.ts` | GET(자격 검증) |
| `apps/shop/src/app/api/reviews/[reviewId]/route.ts` | PATCH(수정) + DELETE(삭제) |
| `apps/shop/src/app/api/reviews/upload/route.ts` | POST(이미지 업로드) |
| `apps/shop/src/features/review/index.ts` | barrel export |
| `apps/shop/src/features/review/types.ts` | 타입 정의 |
| `apps/shop/src/features/review/api/index.ts` | API barrel export |
| `apps/shop/src/features/review/api/fetchReviews.ts` | 리뷰 목록 fetch |
| `apps/shop/src/features/review/api/createReview.ts` | 리뷰 작성 |
| `apps/shop/src/features/review/api/updateReview.ts` | 리뷰 수정 |
| `apps/shop/src/features/review/api/deleteReview.ts` | 리뷰 삭제 |
| `apps/shop/src/features/review/api/uploadReviewImages.ts` | 이미지 업로드 |
| `apps/shop/src/features/review/api/checkReviewEligibility.ts` | 자격 검증 |
| `apps/shop/src/features/review/hooks/index.ts` | hooks barrel export |
| `apps/shop/src/features/review/hooks/queries/index.ts` | queries barrel export |
| `apps/shop/src/features/review/hooks/queries/reviewQueries.ts` | query key factory |
| `apps/shop/src/features/review/hooks/queries/useProductReviewsQuery.ts` | infinite query hook |
| `apps/shop/src/features/review/hooks/mutations/useCreateReviewMutation.ts` | 작성 mutation |
| `apps/shop/src/features/review/hooks/mutations/useUpdateReviewMutation.ts` | 수정 mutation |
| `apps/shop/src/features/review/hooks/mutations/useDeleteReviewMutation.ts` | 삭제 mutation |
| `apps/shop/src/features/review/components/index.ts` | components barrel export |

### 신규 컴포넌트 파일 (16개 - tsx + scss 쌍)

| 컴포넌트 | 파일 |
|----------|------|
| StarRating | `StarRating.tsx` + `StarRating.module.scss` |
| RatingDistribution | `RatingDistribution.tsx` + `RatingDistribution.module.scss` |
| RatingSummary | `RatingSummary.tsx` + `RatingSummary.module.scss` |
| ReviewCard | `ReviewCard.tsx` + `ReviewCard.module.scss` |
| ReviewList | `ReviewList.tsx` + `ReviewList.module.scss` |
| ReviewForm | `ReviewForm.tsx` + `ReviewForm.module.scss` |
| ReviewImageUpload | `ReviewImageUpload.tsx` + `ReviewImageUpload.module.scss` |
| ReviewWriteButton | `ReviewWriteButton.tsx` + `ReviewWriteButton.module.scss` |

### 수정 파일 (6개)

| 파일 경로 | 변경 내용 |
|-----------|-----------|
| `supabase/config.toml` | `[storage.buckets.review-images]` 섹션 추가 (`:77-80` 패턴 참조) |
| `apps/shop/src/shared/constants/apiEndpoints.ts` | `reviews`, `reviewUpload` 엔드포인트 추가 (`:7-15`) |
| `apps/shop/src/features/product/types.ts` | `ProductDetail`에 `rating: RatingSummary` 필드 추가 (`:1-10`) |
| `apps/shop/src/app/api/products/[id]/route.ts` | `product_rating_summary` 뷰 조회 추가 (`:22-53`) |
| `apps/shop/src/app/(shop)/product/[id]/page.tsx` | `ReviewSection` 컴포넌트 추가 렌더링 (`:15-33`) |
| `apps/shop/src/features/product/components/Description.tsx` | 평균 평점 + 리뷰 수 표시 추가 (`:3-35`) |

### 선택적 수정 파일 (2개)

| 파일 경로 | 변경 내용 |
|-----------|-----------|
| `apps/shop/src/features/order/components/OrderDetail.tsx` | `OrderProducts` 섹션에 리뷰 작성 버튼 추가 (`:65-78`) |
| `apps/shop/src/features/order/components/OrderProduct.tsx` | 리뷰 작성 상태 표시 prop 추가 (`:5-8`) |

---

## 총 파일 수

- **신규**: 38개 (SQL 1 + API Route 4 + Feature 17 + Component tsx/scss 16)
- **수정**: 6개 (필수) + 2개 (선택)
- **합계**: 44~46개
