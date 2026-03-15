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
