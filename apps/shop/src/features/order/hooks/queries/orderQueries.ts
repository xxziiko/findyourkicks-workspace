import { fetchOrderHistory } from '@/features/order';
import { queryOptions } from '@tanstack/react-query';

export const orderQueries = {
  all: () => ['order'] as const,
  history: (page: number, options?: { headers?: Record<string, string> }) =>
    queryOptions({
      queryKey: [...orderQueries.all(), 'history', page] as const,
      queryFn: () => fetchOrderHistory(page, options),
      refetchOnWindowFocus: false,
    }),
};
