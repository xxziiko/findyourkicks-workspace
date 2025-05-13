import { fetchCartCount, fetchCartList } from '@/features/cart/apis';
import { createQueries } from '@findyourkicks/shared';

export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
} as const;

export const cartQueries = createQueries('cart', {
  list: () => ({
    queryFn: fetchCartList,
  }),
  count: () => ({
    queryFn: fetchCartCount,
  }),
});
