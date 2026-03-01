import {
  type ProductSearchForm,
  getBrands,
  getCategory,
  getFilteredProducts,
  getProductStatus,
  getRecentProducts,
} from '@/features/product';
import { queryOptions } from '@tanstack/react-query';

export const productQueries = {
  all: () => ['product'] as const,
  list: (params: Partial<ProductSearchForm>) =>
    queryOptions({
      queryKey: [...productQueries.all(), 'list', params] as const,
      queryFn: () => getFilteredProducts(params),
      refetchOnWindowFocus: false,
    }),
  recent: (limit: number) =>
    queryOptions({
      queryKey: [...productQueries.all(), 'recent', limit] as const,
      queryFn: () => getRecentProducts(limit),
      refetchOnWindowFocus: false,
    }),
  brand: () =>
    queryOptions({
      queryKey: [...productQueries.all(), 'brand'] as const,
      queryFn: getBrands,
      refetchOnWindowFocus: false,
    }),
  category: () =>
    queryOptions({
      queryKey: [...productQueries.all(), 'category'] as const,
      queryFn: getCategory,
      refetchOnWindowFocus: false,
    }),
  status: () =>
    queryOptions({
      queryKey: [...productQueries.all(), 'status'] as const,
      queryFn: getProductStatus,
      refetchOnWindowFocus: false,
    }),
};
