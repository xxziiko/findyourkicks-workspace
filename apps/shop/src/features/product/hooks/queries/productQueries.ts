import { fetchProducts } from '@/features/product/actions';
import { createQueries } from '@findyourkicks/shared';

export const productKeys = {
  all: ['product'] as const,
  list: () => [...productKeys.all, 'list'] as const,
} as const;

export const productQueries = createQueries('product', {
  list: () => ({
    queryFn: ({ pageParam }) => fetchProducts(pageParam),
  }),
});
