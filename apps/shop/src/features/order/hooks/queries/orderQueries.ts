import { fetchOrderHistory } from '@/features/order';
import { createQueries as createOrderQueries } from '@findyourkicks/shared';

export const orderQueries = createOrderQueries('order', {
  history: (page: number) => ({
    queryFn: () => fetchOrderHistory(page),
  }),
} as const);
