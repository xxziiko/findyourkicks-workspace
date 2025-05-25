import { productQueries } from '@/features/product/hooks/queries/productQueries';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function useProductsQuery() {
  return useSuspenseInfiniteQuery({
    ...productQueries.list(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 30 ? null : pages.length + 1;
    },
    select: (data) => {
      return data.pages.length === 0 ? [] : data.pages.flat();
    },
  });
}
