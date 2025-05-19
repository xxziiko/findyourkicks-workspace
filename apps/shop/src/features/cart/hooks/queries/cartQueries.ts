import { fetchCartCount, fetchCartList } from '@/features/cart/apis';
import { createQueries as createCartQueries } from '@findyourkicks/shared';

export const cartQueries = createCartQueries('cart', {
  list: () => ({
    queryFn: fetchCartList,
  }),
  count: () => ({
    queryFn: fetchCartCount,
  }),
} as const);
