import { fetchCartCount, fetchCartList } from '@/features/cart/apis';
import { queryOptions } from '@tanstack/react-query';

export const cartQueries = {
  all: () => ['cart'] as const,
  list: () =>
    queryOptions({
      queryKey: [...cartQueries.all(), 'list'] as const,
      queryFn: fetchCartList,
      refetchOnWindowFocus: false,
    }),
  count: () =>
    queryOptions({
      queryKey: [...cartQueries.all(), 'count'] as const,
      queryFn: fetchCartCount,
      refetchOnWindowFocus: false,
    }),
};
