import type {
  FilterOptions,
  ProductDetail,
  ProductFilters,
} from '@/features/product/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

const buildProductsQueryString = (
  page: number,
  filters?: ProductFilters,
): string => {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (filters?.q) params.set('q', filters.q);

  if (filters?.brand && filters.brand.length > 0) {
    params.set('brand', filters.brand.join(','));
  }

  if (filters?.category && filters.category.length > 0) {
    params.set('category', filters.category.join(','));
  }

  if (filters?.size && filters.size.length > 0) {
    params.set('size', filters.size.join(','));
  }

  if (filters?.minPrice !== undefined) {
    params.set('minPrice', String(filters.minPrice));
  }

  if (filters?.maxPrice !== undefined) {
    params.set('maxPrice', String(filters.maxPrice));
  }

  if (filters?.sort) params.set('sort', filters.sort);

  return params.toString();
};

export const fetchProducts = async (page = 1, filters?: ProductFilters) => {
  const qs = buildProductsQueryString(page, filters);
  return await api.get<ProductDetail[]>(`${ENDPOINTS.products}?${qs}`);
};

export const fetchFilterOptions = async () => {
  return await api.get<FilterOptions>(`${ENDPOINTS.products}/filters`);
};

// detail
export const fetchProductById = async (productId: string) => {
  return await api.get<ProductDetail>(`${ENDPOINTS.products}/${productId}`);
};

export const fetchProductsByBrand = async (brand: string) => {
  return await fetchProducts(1, { brand: [brand] });
};
