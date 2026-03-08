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
      staleTime: 300_000,
    }),
};
