import { api } from '@/shared/utils/api';
import type { ProductDetail, Products } from './types';

export const fetchProducts = async (page = 1) => {
  return await api.get<Products>(`/products?page=${page}`);
};

// detail
export const fetchProductById = async (productId: string) => {
  return await api.get<ProductDetail>(`/products/${productId}`);
};
