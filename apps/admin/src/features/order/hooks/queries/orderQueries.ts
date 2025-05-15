import { getOrders, getResentOrders } from '@/features/order';
import { createQueries as createOrderQueries } from '@findyourkicks/shared';

const LIMIT = 5;

export const orderQueries = createOrderQueries('orders', {
  list: () => ({
    queryFn: () => getOrders(),
  }),
  resent: () => ({
    queryFn: () => getResentOrders(LIMIT),
  }),
} as const);
