# 상품 검색 + 필터링 기능 설계 문서

## 현재 코드 분석 요약

### 데이터 모델 (Supabase)
- **products** 테이블: `product_id`, `title`, `price`, `image`, `description`, `status`, `created_at`
- **brands** 테이블: FK `fk_product_brand` 로 products와 연결, `name` 필드
- **categories** 테이블: FK `fk_product_category` 로 products와 연결, `name` 필드
- **inventory** 테이블: products와 연결, `size`, `stock` 필드
- **product_with_details** 뷰: products + brands + categories를 조인한 뷰 (현재 리스트 API에서 사용)
- **get_products** RPC 함수: `p_page`, `p_brand` 파라미터를 받아 페이징 처리 (클라이언트에서 직접 호출)

### 현재 API 구조
- `GET /api/products` (`apps/shop/src/app/api/products/route.ts:4-54`)
  - `brand` 파라미터: `product_with_details` 뷰에서 brand로 필터, limit 10, product_id ASC 정렬
  - `page` 파라미터: offset 기반 페이징 (30개씩), `status='selling'` 필터, `created_at DESC` 정렬
- `GET /api/products/[id]` (`apps/shop/src/app/api/products/[id]/route.ts:15-54`)
  - products 테이블에서 brands, categories, inventory 조인

### 현재 프론트엔드 구조
- **actions.ts** (`apps/shop/src/features/product/actions.ts:16-31`): `fetchProducts()` 는 Supabase RPC `get_products` 직접 호출 (API Route 우회)
- **productQueries.ts** (`apps/shop/src/features/product/hooks/queries/productQueries.ts:4-17`): `infiniteQueryOptions`로 무한 스크롤 구성, 30개 미만이면 마지막 페이지
- **useProductsQuery.ts** (`apps/shop/src/features/product/hooks/queries/useProductsQuery.ts:4-11`): `useSuspenseInfiniteQuery`, `data.pages.flat()` 으로 평탄화
- **useProductList.ts** (`apps/shop/src/features/product/hooks/useProductList.ts:7-31`): `useProductsQuery` + `useImagesLoaded` + `ImpressionArea` 기반 fetchNextPage
- **ProductSectionList.tsx** (`apps/shop/src/features/product/components/ProductSectionList.tsx:20-52`): 브랜드별 섹션 + 전체 상품 무한 스크롤
- **홈 페이지** (`apps/shop/src/app/page.tsx:20-53`): SSR에서 vans/nike 브랜드별 fetch + `prefetchInfiniteQuery`로 전체 상품 프리페치

### 기술 스택
- Next.js 15 (App Router, Turbopack)
- TanStack Query v5 (`useSuspenseInfiniteQuery`, `infiniteQueryOptions`)
- Supabase (PostgreSQL 15, `@supabase/supabase-js`)
- Jotai (상태 관리)
- SCSS Modules (반응형: mobile < 768px, tablet >= 768px, desktop >= 1024px)
- `@findyourkicks/shared` 패키지: Button, Modal, GlobalPortal 컴포넌트 제공
- Feature-Sliced Design 패턴 (`features/product/{actions,types,hooks,components}`)

---

## 1. 기능 범위

### 1.1 키워드 검색
- 상품명(`title`), 브랜드명(`brand`) 대상 텍스트 검색
- 한글/영어 부분 일치 지원
- 디바운스 적용 (300ms)

### 1.2 필터링
| 필터 | 소스 | 다중 선택 |
|------|------|-----------|
| 브랜드 | `brands` 테이블 | O |
| 카테고리 | `categories` 테이블 | O |
| 사이즈 | `inventory` 테이블의 고유 size 값 | O |
| 가격 범위 | 최소/최대 가격 입력 | - |

### 1.3 정렬
| 정렬 옵션 | DB 칼럼 | 기본값 |
|-----------|---------|--------|
| 최신순 | `created_at DESC` | O (기본) |
| 낮은 가격순 | `price ASC` | |
| 높은 가격순 | `price DESC` | |
| 인기순 | 주문 수 기반 (orders 집계) | |

### 1.4 URL 파라미터 기반 상태 관리
```
/products?q=에어맥스&brand=nike,adidas&category=sneakers&size=270,275&minPrice=50000&maxPrice=200000&sort=price_asc
```
- 모든 필터 상태를 URL searchParams로 관리
- 필터 URL 공유 가능
- 뒤로가기 시 필터 상태 복원

---

## 2. DB 변경사항

### 2.1 현재 구조 분석

현재 `product_with_details` 뷰는 products + brands + categories를 조인한 뷰로, `GET /api/products` route.ts:13, 37에서 사용 중이다. 이 뷰의 정확한 정의는 Supabase 대시보드에 있으나 마이그레이션 파일이 로컬에 없으므로, 뷰가 최소한 다음 컬럼을 포함한다고 추론된다:
- `product_id`, `title`, `price`, `image`, `status`, `created_at`
- `brand` (brands.name 조인)
- `category` (categories.name 조인)

### 2.2 Full-Text Search vs ILIKE 비교

| 기준 | PostgreSQL Full-Text Search | ILIKE |
|------|---------------------------|-------|
| 한글 지원 | `pg_trgm` 확장 필요 (trigram 기반) | 기본 지원 |
| 성능 (1만건 이하) | 오버헤드 대비 이점 적음 | 충분 |
| 성능 (10만건 이상) | GIN 인덱스로 우수 | 풀 스캔 위험 |
| 구현 복잡도 | tsvector 칼럼 + 트리거 필요 | 간단 |
| 부분 일치 | 추가 설정 필요 | 기본 지원 |
| Supabase 호환 | textSearch() 메서드 지원 | ilike() 메서드 지원 |

**추천: ILIKE + pg_trgm 인덱스**

현재 상품 수가 대규모가 아닌 신발 쇼핑몰 특성상, ILIKE가 구현이 간단하고 한글 부분 일치를 자연스럽게 지원한다. `pg_trgm` GIN 인덱스를 추가하면 ILIKE 성능도 충분히 확보 가능하다. 향후 상품이 10만건 이상으로 증가하면 FTS로 마이그레이션을 고려한다.

### 2.3 필요한 인덱스

```sql
-- pg_trgm 확장 (Supabase에 기본 설치되어 있음)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 2.4 Supabase 마이그레이션 파일

**파일: `supabase/migrations/20260302000001_add_search_filter_indexes.sql`**

```sql
-- ==============================================
-- 상품 검색 + 필터링을 위한 인덱스 및 뷰 변경
-- ==============================================

-- 1. pg_trgm 확장 활성화 (ILIKE 성능 최적화)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. 검색용 trigram 인덱스 (title ILIKE '%keyword%' 가속)
CREATE INDEX IF NOT EXISTS idx_products_title_trgm
  ON products USING gin (title gin_trgm_ops);

-- 3. 필터링용 인덱스
-- brand_id, category_id 기반 필터링 (FK이므로 이미 있을 수 있으나 명시적 추가)
CREATE INDEX IF NOT EXISTS idx_products_brand_id
  ON products (brand_id);

CREATE INDEX IF NOT EXISTS idx_products_category_id
  ON products (category_id);

-- status + created_at 복합 인덱스 (기본 리스트 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_products_status_created
  ON products (status, created_at DESC);

-- 가격 범위 필터링용 인덱스
CREATE INDEX IF NOT EXISTS idx_products_price
  ON products (price);

-- inventory size 검색용 인덱스
CREATE INDEX IF NOT EXISTS idx_inventory_size
  ON inventory (size);

-- 4. product_with_details 뷰에 category 칼럼 포함 확인
-- (현재 뷰 정의가 category를 이미 포함하고 있다면 불필요)
-- 필요 시 뷰 재정의:
--
-- CREATE OR REPLACE VIEW product_with_details AS
-- SELECT
--   p.product_id,
--   p.title,
--   p.price,
--   p.image,
--   p.description,
--   p.status,
--   p.created_at,
--   b.name AS brand,
--   c.name AS category
-- FROM products p
-- LEFT JOIN brands b ON p.brand_id = b.brand_id
-- LEFT JOIN categories c ON p.category_id = c.category_id;

-- 5. 인기순 정렬을 위한 Materialized View (선택적)
-- 주문 수 기반 인기도를 사전 집계하여 정렬 성능 확보
CREATE MATERIALIZED VIEW IF NOT EXISTS product_popularity AS
SELECT
  oi.product_id,
  COUNT(oi.order_item_id) AS order_count
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
GROUP BY oi.product_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_popularity_pid
  ON product_popularity (product_id);

-- 인기도 새로고침 함수 (크론잡 또는 수동 호출)
CREATE OR REPLACE FUNCTION refresh_product_popularity()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_popularity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 필터 옵션 조회용 함수 (브랜드, 카테고리, 사이즈 목록)
CREATE OR REPLACE FUNCTION get_filter_options()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'brands', (
      SELECT json_agg(json_build_object('id', brand_id, 'name', name))
      FROM brands
      ORDER BY name
    ),
    'categories', (
      SELECT json_agg(json_build_object('id', category_id, 'name', name))
      FROM categories
      ORDER BY name
    ),
    'sizes', (
      SELECT json_agg(DISTINCT size ORDER BY size)
      FROM inventory
      WHERE stock > 0
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## 3. API 설계

### 3.1 현재 `GET /api/products` 분석

현재 route.ts (apps/shop/src/app/api/products/route.ts:4-54)는 두 가지 분기를 가진다:
1. `brand` 파라미터 있으면: 해당 브랜드 상품 10개 (홈페이지 섹션용)
2. `brand` 없으면: `page` 기반 offset 페이징, 30개씩, status='selling'

**문제점**: 클라이언트의 `actions.ts:16-31`에서 `fetchProducts()`는 이 API Route를 사용하지 않고 Supabase RPC `get_products`를 직접 호출한다. 검색/필터 기능 추가 시 API Route로 통일하는 것이 바람직하다.

### 3.2 확장된 쿼리 파라미터

```
GET /api/products?q=에어맥스&brand=nike,adidas&category=sneakers&size=270,275&minPrice=50000&maxPrice=200000&sort=latest&page=1
```

| 파라미터 | 타입 | 설명 | 기본값 |
|---------|------|------|--------|
| `q` | string | 검색 키워드 (title, brand ILIKE) | - |
| `brand` | string | 콤마 구분 브랜드명 | - |
| `category` | string | 콤마 구분 카테고리명 | - |
| `size` | string | 콤마 구분 사이즈 | - |
| `minPrice` | number | 최소 가격 | - |
| `maxPrice` | number | 최대 가격 | - |
| `sort` | enum | `latest`, `price_asc`, `price_desc`, `popular` | `latest` |
| `page` | number | 페이지 번호 (1부터) | 1 |

### 3.3 확장된 route.ts 구현 방안

```typescript
// apps/shop/src/app/api/products/route.ts
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

const PAGE_SIZE = 30;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  // 파라미터 파싱
  const q = searchParams.get('q');
  const brands = searchParams.get('brand')?.split(',').filter(Boolean);
  const categories = searchParams.get('category')?.split(',').filter(Boolean);
  const sizes = searchParams.get('size')?.split(',').filter(Boolean);
  const minPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : null;
  const sort = searchParams.get('sort') ?? 'latest';
  const page = Number(searchParams.get('page') ?? '1');

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 기본 쿼리: product_with_details 뷰 사용
  let query = supabase
    .from('product_with_details')
    .select('*')
    .eq('status', 'selling');

  // 검색 키워드 (title 또는 brand에 ILIKE)
  if (q) {
    query = query.or(`title.ilike.%${q}%,brand.ilike.%${q}%`);
  }

  // 브랜드 필터
  if (brands && brands.length > 0) {
    query = query.in('brand', brands);
  }

  // 카테고리 필터
  if (categories && categories.length > 0) {
    query = query.in('category', categories);
  }

  // 가격 범위 필터
  if (minPrice !== null) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte('price', maxPrice);
  }

  // 정렬
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'popular':
      // product_popularity 뷰 조인이 필요하므로 별도 RPC 또는 뷰 확장 필요
      // 대안: product_with_details 뷰에 order_count 칼럼 추가
      query = query.order('created_at', { ascending: false }); // fallback
      break;
    case 'latest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // 사이즈 필터: inventory 조인이 필요하므로 별도 처리
  // product_with_details 뷰에 사이즈 정보가 없으므로,
  // 사이즈 필터가 있을 경우 products 테이블에서 직접 조인 쿼리 사용
  if (sizes && sizes.length > 0) {
    // 해당 사이즈의 재고가 있는 product_id 목록을 먼저 조회
    const { data: sizeFilteredIds } = await supabase
      .from('inventory')
      .select('product_id')
      .in('size', sizes)
      .gt('stock', 0);

    if (sizeFilteredIds && sizeFilteredIds.length > 0) {
      const productIds = [...new Set(sizeFilteredIds.map((i) => i.product_id))];
      query = query.in('product_id', productIds);
    } else {
      return NextResponse.json([]);
    }
  }

  // 페이징
  query = query.range(from, to);

  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const response = products.map(({ product_id, ...product }) => ({
    productId: product_id,
    ...product,
  }));

  return NextResponse.json(response);
}
```

### 3.4 필터 옵션 API (신규)

```
GET /api/products/filters
```

```typescript
// apps/shop/src/app/api/products/filters/route.ts
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_filter_options');

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

### 3.5 기존 infinite scroll 유지 방안

현재 `productQueries.ts:8-16`에서 `pageParam`을 페이지 번호로 사용하고, 30개 미만 반환 시 `null`을 반환하여 마지막 페이지를 판단한다. 이 로직은 필터를 추가해도 동일하게 유지된다.

핵심 변경: `fetchProducts(pageParam)` 호출 시 필터 파라미터를 함께 전달하고, `queryKey`에 필터 조건을 포함하여 필터 변경 시 캐시를 무효화한다.

---

## 4. 프론트엔드 설계

### 4.1 타입 정의

```typescript
// apps/shop/src/features/product/types.ts (확장)

export interface ProductFilters {
  q?: string;
  brand?: string[];
  category?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular';

export interface FilterOptions {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  sizes: string[];
}
```

### 4.2 actions.ts 변경

현재 `actions.ts:16-31`의 `fetchProducts()`가 Supabase RPC를 직접 호출하고 있으나, 검색/필터 기능 추가 시 API Route를 통해 통일한다.

```typescript
// apps/shop/src/features/product/actions.ts (변경)
import type { ProductDetail, ProductFilters } from '@/features/product/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const fetchProducts = async (page = 1, filters?: ProductFilters) => {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (filters?.q) params.set('q', filters.q);
  if (filters?.brand?.length) params.set('brand', filters.brand.join(','));
  if (filters?.category?.length) params.set('category', filters.category.join(','));
  if (filters?.size?.length) params.set('size', filters.size.join(','));
  if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters?.sort) params.set('sort', filters.sort);

  return await api.get<ProductItem[]>(`${ENDPOINTS.products}?${params.toString()}`);
};

export const fetchFilterOptions = async () => {
  return await api.get<FilterOptions>(`${ENDPOINTS.products}/filters`);
};

// fetchProductById, fetchProductsByBrand 유지
```

### 4.3 Query 레이어 변경

```typescript
// apps/shop/src/features/product/hooks/queries/productQueries.ts (변경)
import { fetchFilterOptions, fetchProducts } from '@/features/product/actions';
import type { ProductFilters } from '@/features/product/types';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

export const productQueries = {
  all: () => ['product'] as const,

  list: (filters?: ProductFilters) =>
    infiniteQueryOptions({
      queryKey: [...productQueries.all(), 'list', filters ?? {}] as const,
      queryFn: ({ pageParam }) => fetchProducts(pageParam, filters),
      initialPageParam: 1,
      getNextPageParam: (
        lastPage: Awaited<ReturnType<typeof fetchProducts>>,
        pages,
      ) => (lastPage.length < 30 ? null : pages.length + 1),
      refetchOnWindowFocus: false,
    }),

  filterOptions: () =>
    queryOptions({
      queryKey: [...productQueries.all(), 'filterOptions'] as const,
      queryFn: fetchFilterOptions,
      staleTime: 5 * 60 * 1000, // 필터 옵션은 5분 캐시
    }),
};
```

```typescript
// apps/shop/src/features/product/hooks/queries/useProductsQuery.ts (변경)
import { productQueries } from '@/features/product/hooks/queries/productQueries';
import type { ProductFilters } from '@/features/product/types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function useProductsQuery(filters?: ProductFilters) {
  return useSuspenseInfiniteQuery({
    ...productQueries.list(filters),
    select: (data) => {
      return data.pages.length === 0 ? [] : data.pages.flat();
    },
  });
}
```

### 4.4 URL <-> 필터 상태 동기화 훅

```typescript
// apps/shop/src/features/product/hooks/useProductFilters.ts (신규)
'use client';

import type { ProductFilters, SortOption } from '@/features/product/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL searchParams -> ProductFilters 파싱
  const filters: ProductFilters = useMemo(() => ({
    q: searchParams.get('q') || undefined,
    brand: searchParams.get('brand')?.split(',').filter(Boolean) || undefined,
    category: searchParams.get('category')?.split(',').filter(Boolean) || undefined,
    size: searchParams.get('size')?.split(',').filter(Boolean) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: (searchParams.get('sort') as SortOption) || undefined,
  }), [searchParams]);

  // ProductFilters -> URL searchParams 업데이트
  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // 병합
    const merged = { ...filters, ...newFilters };

    // 각 필터를 URL 파라미터로 설정 (빈 값은 삭제)
    const setOrDelete = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete('q', merged.q);
    setOrDelete('brand', merged.brand?.join(','));
    setOrDelete('category', merged.category?.join(','));
    setOrDelete('size', merged.size?.join(','));
    setOrDelete('minPrice', merged.minPrice != null ? String(merged.minPrice) : undefined);
    setOrDelete('maxPrice', merged.maxPrice != null ? String(merged.maxPrice) : undefined);
    setOrDelete('sort', merged.sort);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router, searchParams]);

  // 전체 필터 초기화
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // 활성 필터 수 계산
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.category?.length) count += filters.category.length;
    if (filters.size?.length) count += filters.size.length;
    if (filters.minPrice != null || filters.maxPrice != null) count++;
    return count;
  }, [filters]);

  return { filters, setFilters, clearFilters, activeFilterCount };
}
```

### 4.5 신규 컴포넌트 목록

#### SearchBar
```
apps/shop/src/features/product/components/SearchBar.tsx
apps/shop/src/features/product/components/SearchBar.module.scss
```
- 검색 아이콘 + 텍스트 입력
- 300ms 디바운스로 `setFilters({ q: value })` 호출
- Enter 키 또는 아이콘 클릭으로 즉시 검색
- lucide-react의 `Search`, `X` 아이콘 사용 (이미 프로젝트 의존성에 포함)
- 헤더 하단 또는 검색 페이지 상단에 배치

#### FilterPanel
```
apps/shop/src/features/product/components/FilterPanel.tsx
apps/shop/src/features/product/components/FilterPanel.module.scss
```
- 데스크탑: 사이드바 형태 (좌측 고정, 상품 그리드 우측)
- 브랜드 체크박스 그룹
- 카테고리 체크박스 그룹
- 사이즈 버튼 그룹 (기존 `Button variant="secondary"` 재사용)
- 가격 범위: 최소/최대 input[type="number"]
- "필터 초기화" 버튼

#### SortSelect
```
apps/shop/src/features/product/components/SortSelect.tsx
apps/shop/src/features/product/components/SortSelect.module.scss
```
- native `<select>` 또는 커스텀 드롭다운
- 옵션: 최신순, 낮은 가격순, 높은 가격순, 인기순
- `setFilters({ sort: value })` 호출

#### FilterChips
```
apps/shop/src/features/product/components/FilterChips.tsx
apps/shop/src/features/product/components/FilterChips.module.scss
```
- 현재 활성화된 필터를 칩(태그) 형태로 표시
- 각 칩에 X 버튼으로 개별 필터 해제
- "전체 해제" 버튼

#### MobileFilterDrawer
```
apps/shop/src/features/product/components/MobileFilterDrawer.tsx
apps/shop/src/features/product/components/MobileFilterDrawer.module.scss
```
- 모바일에서 "필터" 버튼 클릭 시 하단에서 슬라이드업하는 Bottom Sheet
- 기존 `GlobalPortal`을 활용한 포탈 렌더링 (Modal.tsx:22-32 패턴 동일)
- `document.body.style.overflow = 'hidden'` 스크롤 잠금 (Modal.tsx:14-18 패턴 동일)
- FilterPanel과 동일한 필터 옵션 제공
- "적용" 버튼으로 필터 일괄 적용

### 4.6 useProductList 훅 변경

```typescript
// apps/shop/src/features/product/hooks/useProductList.ts (변경)
'use client';

import { useProductsQuery } from '@/features/product';
import { useProductFilters } from '@/features/product/hooks/useProductFilters';
import { useImagesLoaded } from '@/shared/hooks';
import { useRef } from 'react';

export default function useProductList() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { filters, setFilters, clearFilters, activeFilterCount } = useProductFilters();

  const {
    data: productList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductsQuery(filters);

  const { allLoaded, handleImageLoad } = useImagesLoaded(productList.length);

  const handleFetchNextPage = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  return {
    productList,
    allLoaded,
    isFetchingNextPage,
    loadMoreRef,
    handleImageLoad,
    handleFetchNextPage,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
  };
}
```

### 4.7 검색 결과 페이지

검색/필터 기능은 새로운 `/products` 페이지에서 동작한다. 홈페이지(`/`)는 기존 브랜드 섹션 + 전체 상품 무한 스크롤을 유지한다.

```
apps/shop/src/app/(shop)/products/page.tsx       (신규)
apps/shop/src/app/(shop)/products/loading.tsx     (신규)
```

```typescript
// apps/shop/src/app/(shop)/products/page.tsx (신규)
import { ProductSearchPage } from '@/features/product/components/ProductSearchPage';
import { Suspense } from 'react';

export default function Products() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductSearchPage />
    </Suspense>
  );
}
```

#### 레이아웃 구조 (데스크탑)
```
+--------------------------------------------------+
| Header                              [SearchBar]  |
+--------------------------------------------------+
| [FilterChips: nike x | sneakers x | 전체해제]     |
+--------------------------------------------------+
| FilterPanel  |  [SortSelect: 최신순 v]            |
| (사이드바)    |  +------+------+------+------+    |
|              |  | Card | Card | Card | Card |    |
| 브랜드       |  +------+------+------+------+    |
| [x] Nike     |  | Card | Card | Card | Card |    |
| [x] Vans     |  +------+------+------+------+    |
| ...          |  | ...infinite scroll...      |    |
|              |                                    |
| 카테고리      |                                    |
| [x] Sneakers |                                    |
| ...          |                                    |
|              |                                    |
| 사이즈        |                                    |
| [250][255]   |                                    |
| [260][265]   |                                    |
|              |                                    |
| 가격 범위     |                                    |
| [min] ~ [max]|                                    |
+--------------------------------------------------+
```

#### 레이아웃 구조 (모바일)
```
+-------------------------+
| Header                  |
+-------------------------+
| [SearchBar            ] |
+-------------------------+
| [필터 (3)] [최신순 v]    |
+-------------------------+
| [nike x][sneakers x]    |
+-------------------------+
| +------+------+         |
| | Card | Card |         |
| +------+------+         |
| | Card | Card |         |
| +------+------+         |
| | ...scroll...          |
+-------------------------+

(필터 버튼 클릭 시)
+-------------------------+
| 필터          [X 닫기]  |
|                         |
| 브랜드                   |
| [x] Nike [x] Vans      |
|                         |
| 카테고리                 |
| [x] Sneakers            |
|                         |
| 사이즈                   |
| [250][255][260]         |
|                         |
| 가격 범위                |
| [min] ~ [max]           |
|                         |
| [초기화]     [적용하기]  |
+-------------------------+
```

### 4.8 헤더에 검색 진입점 추가

현재 `Header.tsx`에는 로고, 유저 정보, MY PAGE, 장바구니, LOGOUT/LOGIN만 있다. 검색 진입점을 추가한다.

```typescript
// apps/shop/src/app/_layouts/header/Header.tsx 에 검색 아이콘 추가
// Search 아이콘 클릭 시 /products 페이지로 이동
// 또는 헤더에 미니 SearchBar 인라인 배치
```

---

## 5. 구현 순서 (단계별 의존성 고려)

### Phase 1: DB + API 기반 (프론트와 독립)
1. **마이그레이션 파일 작성 및 적용** - 인덱스, Materialized View 생성
2. **`GET /api/products` route.ts 확장** - 쿼리 파라미터 파싱 + 필터/정렬/검색 로직
3. **`GET /api/products/filters` route.ts 신규** - 필터 옵션 API

### Phase 2: 타입 + 훅 레이어
4. **types.ts 확장** - `ProductFilters`, `SortOption`, `FilterOptions` 타입 추가
5. **actions.ts 변경** - `fetchProducts()` API Route 호출로 전환, `fetchFilterOptions()` 추가
6. **productQueries.ts 변경** - `list(filters)` 파라미터 추가, `filterOptions()` 쿼리 추가
7. **useProductsQuery.ts 변경** - filters 파라미터 전달
8. **useProductFilters.ts 신규** - URL <-> 필터 상태 동기화 훅

### Phase 3: UI 컴포넌트
9. **SearchBar 컴포넌트** - 디바운스 검색 입력
10. **SortSelect 컴포넌트** - 정렬 드롭다운
11. **FilterPanel 컴포넌트** - 브랜드/카테고리/사이즈/가격 필터
12. **FilterChips 컴포넌트** - 활성 필터 칩 표시
13. **MobileFilterDrawer 컴포넌트** - 모바일 필터 Bottom Sheet

### Phase 4: 페이지 통합
14. **useProductList.ts 변경** - filters 연동
15. **/products 페이지 생성** - 검색 결과 페이지
16. **Header.tsx 수정** - 검색 진입점 추가
17. **constants.ts, path.ts 수정** - 경로 상수 추가

### Phase 5: 최적화 + 마무리
18. **인기순 정렬 연동** - product_popularity Materialized View 활용
19. **SSR prefetch 적용** - /products 페이지 서버 컴포넌트에서 초기 데이터 프리페치
20. **E2E 테스트** - 검색/필터 시나리오 테스트

---

## 6. 예상 파일 변경 목록

### 신규 파일
| 파일 | 설명 |
|------|------|
| `supabase/migrations/20260302000001_add_search_filter_indexes.sql` | DB 인덱스, Materialized View, RPC 함수 |
| `apps/shop/src/app/api/products/filters/route.ts` | 필터 옵션 API |
| `apps/shop/src/features/product/hooks/useProductFilters.ts` | URL <-> 필터 동기화 훅 |
| `apps/shop/src/features/product/components/SearchBar.tsx` | 검색바 컴포넌트 |
| `apps/shop/src/features/product/components/SearchBar.module.scss` | 검색바 스타일 |
| `apps/shop/src/features/product/components/FilterPanel.tsx` | 필터 패널 컴포넌트 |
| `apps/shop/src/features/product/components/FilterPanel.module.scss` | 필터 패널 스타일 |
| `apps/shop/src/features/product/components/SortSelect.tsx` | 정렬 드롭다운 컴포넌트 |
| `apps/shop/src/features/product/components/SortSelect.module.scss` | 정렬 드롭다운 스타일 |
| `apps/shop/src/features/product/components/FilterChips.tsx` | 필터 칩 컴포넌트 |
| `apps/shop/src/features/product/components/FilterChips.module.scss` | 필터 칩 스타일 |
| `apps/shop/src/features/product/components/MobileFilterDrawer.tsx` | 모바일 필터 Drawer |
| `apps/shop/src/features/product/components/MobileFilterDrawer.module.scss` | 모바일 필터 Drawer 스타일 |
| `apps/shop/src/features/product/components/ProductSearchPage.tsx` | 검색 결과 통합 컴포넌트 |
| `apps/shop/src/features/product/components/ProductSearchPage.module.scss` | 검색 결과 페이지 스타일 |
| `apps/shop/src/app/(shop)/products/page.tsx` | /products 페이지 |
| `apps/shop/src/app/(shop)/products/loading.tsx` | /products 로딩 UI |

### 수정 파일
| 파일 | 변경 내용 |
|------|----------|
| `apps/shop/src/features/product/types.ts` | `ProductFilters`, `SortOption`, `FilterOptions` 타입 추가 |
| `apps/shop/src/features/product/actions.ts` | `fetchProducts()` API Route 호출로 변경, `fetchFilterOptions()` 추가 |
| `apps/shop/src/features/product/hooks/queries/productQueries.ts` | `list(filters)` 파라미터, `filterOptions()` 쿼리 추가 |
| `apps/shop/src/features/product/hooks/queries/useProductsQuery.ts` | filters 파라미터 전달 |
| `apps/shop/src/features/product/hooks/useProductList.ts` | `useProductFilters` 통합 |
| `apps/shop/src/features/product/hooks/index.ts` | `useProductFilters` export 추가 |
| `apps/shop/src/features/product/components/index.ts` | 신규 컴포넌트 export 추가 |
| `apps/shop/src/features/product/index.ts` | 변경 없음 (barrel export 자동 반영) |
| `apps/shop/src/app/api/products/route.ts` | 쿼리 파라미터 확장 (q, brand, category, size, minPrice, maxPrice, sort) |
| `apps/shop/src/app/_layouts/header/Header.tsx` | 검색 아이콘/링크 추가 |
| `apps/shop/src/app/_layouts/header/Header.module.scss` | 검색 아이콘 스타일 |
| `apps/shop/src/shared/constants/path.ts` | `PATH.products` 경로 값을 `/products`로 활용 (이미 존재: `product: '/products'`) |
| `apps/shop/src/shared/constants/apiEndpoints.ts` | 변경 없음 (`products: '/products'` 이미 존재) |

### 변경하지 않는 파일 (영향 분석)
| 파일 | 이유 |
|------|------|
| `apps/shop/src/app/page.tsx` | 홈페이지는 기존 브랜드 섹션 + 무한 스크롤 유지. 검색은 별도 /products 페이지 |
| `apps/shop/src/features/product/components/ProductSection.tsx` | 기존 상품 카드 리스트 렌더링. 검색 결과에서도 재사용 |
| `apps/shop/src/features/product/components/ProductCardBtn.tsx` | 기존 상품 카드. 변경 불필요 |
| `apps/shop/src/features/product/hooks/useProductOption.ts` | 상품 상세 옵션 선택용. 검색과 무관 |
| `apps/shop/src/app/api/products/[id]/route.ts` | 상품 상세 API. 변경 불필요 |
