import { getOrders, getRecentOrders } from '@/features/order';
import { createQueries as createOrderQueries } from '@findyourkicks/shared';

export const orderQueries = createOrderQueries('orders', {
  list: () => ({
    queryFn: () => getOrders(),
  }),
  recent: (limit: number) => ({
    queryFn: () => getRecentOrders(limit),
  }),
} as const);
