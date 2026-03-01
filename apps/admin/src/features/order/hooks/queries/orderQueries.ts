import { getOrders, getRecentOrders } from '@/features/order';
import { queryOptions } from '@tanstack/react-query';

export const orderQueries = {
  all: () => ['orders'] as const,
  list: () =>
    queryOptions({
      queryKey: [...orderQueries.all(), 'list'] as const,
      queryFn: () => getOrders(),
      refetchOnWindowFocus: false,
    }),
  recent: (limit: number) =>
    queryOptions({
      queryKey: [...orderQueries.all(), 'recent', limit] as const,
      queryFn: () => getRecentOrders(limit),
      refetchOnWindowFocus: false,
    }),
};
