import { cartQueries } from '@/features/cart';
import type { CartList } from '@/features/cart/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useCartQuery() {
  return useSuspenseQuery<CartList>(cartQueries.list());
}
