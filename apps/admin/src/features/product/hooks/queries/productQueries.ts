import { getProducts, getResentProducts } from '@/features/product';
import { createQueries as createProductQueries } from '@findyourkicks/shared';

export const productQueries = createProductQueries('product', {
  list: () => ({ queryFn: () => getProducts() }),
  recent: (limit: number) => ({ queryFn: () => getResentProducts(limit) }),
});
