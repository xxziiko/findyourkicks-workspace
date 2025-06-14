import {
  type ProductSearchForm,
  getBrands,
  getCategories,
  getFilteredProducts,
  getRecentProducts,
} from '@/features/product';
import { createQueries as createProductQueries } from '@findyourkicks/shared';

export const productQueries = createProductQueries('product', {
  list: () => ({
    queryFn: (filters: ProductSearchForm) => getFilteredProducts(filters),
  }),
  recent: (limit: number) => ({ queryFn: () => getRecentProducts(limit) }),
  brand: () => ({ queryFn: getBrands }),
  category: () => ({ queryFn: getCategories }),
});
