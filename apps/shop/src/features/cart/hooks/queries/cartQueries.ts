import { fetchCartCount, fetchCartList } from '@/features/cart/apis';
import { createQueries } from '@findyourkicks/shared';

export const cartQueries = createQueries('cart', {
  list: () => ({
    queryFn: fetchCartList,
  }),
  count: () => ({
    queryFn: fetchCartCount,
  }),
});
