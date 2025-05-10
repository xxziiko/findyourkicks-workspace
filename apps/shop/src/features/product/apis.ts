import type { ProductDetail, Products } from '@/features/product/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const fetchProducts = async (page = 1) => {
  return await api.get<Products>(`${ENDPOINTS.products}?page=${page}`);
};

// detail
export const fetchProductById = async (productId: string) => {
  return await api.get<ProductDetail>(`${ENDPOINTS.products}/${productId}`);
};

export const fetchProductsByBrand = async (brand: string) => {
  return await api.get<Products>(`${ENDPOINTS.products}?brand=${brand}`);
};
