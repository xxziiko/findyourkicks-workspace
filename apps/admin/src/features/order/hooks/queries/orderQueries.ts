import { getOrders, getResentOrders } from '@/features/order';
import { createQueries as createOrderQueries } from '@findyourkicks/shared';

export const orderQueries = createOrderQueries('orders', {
  list: () => ({
    queryFn: () => getOrders(),
  }),
  resent: (limit: number) => ({
    queryFn: () => getResentOrders(limit),
  }),
} as const);
