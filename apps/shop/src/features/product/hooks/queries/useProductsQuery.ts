import { productQueries } from '@/features/product/hooks/queries/productQueries';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function useProductsQuery() {
  return useSuspenseInfiniteQuery({
    ...productQueries.list(),
    select: (data) => {
      return data.pages.length === 0 ? [] : data.pages.flat();
    },
  });
}
