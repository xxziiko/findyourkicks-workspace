import { fetchCartList } from './apis';

export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
} as const;

export const cartQueries = {
  list: () => ({
    queryKey: cartKeys.list(),
    queryFn: fetchCartList,
    staleTime: 60,
  }),
} as const;
