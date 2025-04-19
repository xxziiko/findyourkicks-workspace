import { fetchCartCount, fetchCartList } from '@/features/cart/apis';

export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
} as const;

export const cartQueries = {
  list: () => ({
    queryKey: cartKeys.list(),
    queryFn: fetchCartList,
    staleTime: 60,
    refetchOnWindowFocus: false,
  }),
  count: (userId: string) => ({
    queryKey: cartKeys.count(),
    queryFn: fetchCartCount,
    enabled: !!userId,
  }),
} as const;
