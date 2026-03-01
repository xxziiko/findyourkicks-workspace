import { fetchProducts } from '@/features/product/actions';
import { infiniteQueryOptions } from '@tanstack/react-query';

export const productQueries = {
  all: () => ['product'] as const,
  list: () =>
    infiniteQueryOptions({
      queryKey: [...productQueries.all(), 'list'] as const,
      queryFn: ({ pageParam }) => fetchProducts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (
        lastPage: Awaited<ReturnType<typeof fetchProducts>>,
        pages,
      ) => (lastPage.length < 30 ? null : pages.length + 1),
      refetchOnWindowFocus: false,
    }),
};
