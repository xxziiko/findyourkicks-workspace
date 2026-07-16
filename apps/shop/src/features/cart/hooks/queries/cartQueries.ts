import { fetchCartCount, fetchCartList } from '@/features/cart/apis';
import { queryOptions } from '@tanstack/react-query';

export const cartQueries = {
  all: () => ['cart'] as const,
  list: (options?: { headers?: Record<string, string> }) =>
    queryOptions({
      queryKey: [...cartQueries.all(), 'list'] as const,
      queryFn: () => fetchCartList(options),
      refetchOnWindowFocus: false,
    }),
  count: () =>
    queryOptions({
      queryKey: [...cartQueries.all(), 'count'] as const,
      queryFn: fetchCartCount,
      refetchOnWindowFocus: false,
    }),
};
