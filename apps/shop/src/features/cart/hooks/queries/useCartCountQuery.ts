import { cartQueries } from '@/features/cart';
import { useQuery } from '@tanstack/react-query';

export function useCartCountQuery(userId: string) {
  return useQuery({
    ...cartQueries.count(),
    enabled: !!userId,
  });
}
