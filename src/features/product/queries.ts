import { fetchProductById } from '@/features/product/apis';

export const productKeys = {
  all: ['product'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  detail: (productId: string) =>
    [...productKeys.all, 'detail', productId] as const,
} as const;

export const productQueries = {
  detail: (productId: string) => ({
    queryKey: productKeys.detail(productId),
    queryFn: fetchProductById(productId),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  }),
} as const;
