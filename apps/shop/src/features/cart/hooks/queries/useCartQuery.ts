import { cartQueries } from '@/features/cart';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useCartQuery() {
  return useSuspenseQuery(cartQueries.list());
}
