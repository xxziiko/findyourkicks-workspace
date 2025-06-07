import {
  getBrands,
  getCategories,
  getProducts,
  getRecentProducts,
} from '@/features/product';
import { createQueries as createProductQueries } from '@findyourkicks/shared';

export const productQueries = createProductQueries('product', {
  list: () => ({ queryFn: () => getProducts() }),
  recent: (limit: number) => ({ queryFn: () => getRecentProducts(limit) }),
  brand: () => ({ queryFn: getBrands }),
  category: () => ({ queryFn: getCategories }),
});
