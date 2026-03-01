import { fetchOrderHistory } from '@/features/order';
import { queryOptions } from '@tanstack/react-query';

export const orderQueries = {
  all: () => ['order'] as const,
  history: (page: number) =>
    queryOptions({
      queryKey: [...orderQueries.all(), 'history', page] as const,
      queryFn: () => fetchOrderHistory(page),
      refetchOnWindowFocus: false,
    }),
};
