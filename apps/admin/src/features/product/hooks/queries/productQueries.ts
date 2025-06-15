import {
  type ProductSearchForm,
  getBrands,
  getCategories,
  getFilteredProducts,
  getProductStatus,
  getRecentProducts,
} from '@/features/product';
import { createQueries as createProductQueries } from '@findyourkicks/shared';

export const productQueries = createProductQueries('product', {
  list: (params: Partial<ProductSearchForm>) => ({
    queryFn: () => getFilteredProducts(params),
  }),
  recent: (limit: number) => ({ queryFn: () => getRecentProducts(limit) }),
  brand: () => ({ queryFn: getBrands }),
  category: () => ({ queryFn: getCategories }),
  status: () => ({ queryFn: getProductStatus }),
});
