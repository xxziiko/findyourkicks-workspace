'use client';

import type { ProductFilters, SortOption } from '@/features/product/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const SORT_VALUES: SortOption[] = [
  'latest',
  'price_asc',
  'price_desc',
  'popular',
];

function isValidSort(value: string): value is SortOption {
  return SORT_VALUES.includes(value as SortOption);
}

function readFiltersFromSearchParams(
  searchParams: ReturnType<typeof useSearchParams>,
): ProductFilters {
  const q = searchParams.get('q') ?? undefined;
  const brand = searchParams.getAll('brand');
  const category = searchParams.getAll('category');
  const size = searchParams.getAll('size');
  const minPriceRaw = searchParams.get('minPrice');
  const maxPriceRaw = searchParams.get('maxPrice');
  const sortRaw = searchParams.get('sort');

  return {
    ...(q ? { q } : {}),
    ...(brand.length > 0 ? { brand } : {}),
    ...(category.length > 0 ? { category } : {}),
    ...(size.length > 0 ? { size } : {}),
    ...(minPriceRaw !== null ? { minPrice: Number(minPriceRaw) } : {}),
    ...(maxPriceRaw !== null ? { maxPrice: Number(maxPriceRaw) } : {}),
    ...(sortRaw && isValidSort(sortRaw) ? { sort: sortRaw } : {}),
  };
}

function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);

  if (filters.brand) {
    for (const b of filters.brand) {
      params.append('brand', b);
    }
  }

  if (filters.category) {
    for (const c of filters.category) {
      params.append('category', c);
    }
  }

  if (filters.size) {
    for (const s of filters.size) {
      params.append('size', s);
    }
  }

  if (filters.minPrice !== undefined) {
    params.set('minPrice', String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set('maxPrice', String(filters.maxPrice));
  }

  if (filters.sort) {
    params.set('sort', filters.sort);
  }

  return params;
}

function countActiveFilters(filters: ProductFilters): number {
  let count = 0;

  if (filters.q && filters.q.trim() !== '') count++;
  if (filters.brand && filters.brand.length > 0) count++;
  if (filters.category && filters.category.length > 0) count++;
  if (filters.size && filters.size.length > 0) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.sort && filters.sort !== 'latest') count++;

  return count;
}

export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = readFiltersFromSearchParams(searchParams);
  const activeFilterCount = countActiveFilters(filters);

  const setFilters = useCallback(
    (nextFilters: ProductFilters) => {
      const params = filtersToSearchParams(nextFilters);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { filters, setFilters, clearFilters, activeFilterCount };
}
