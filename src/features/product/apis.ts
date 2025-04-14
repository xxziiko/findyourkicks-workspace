import { api } from '@/shared/utils/api';
import type { ProductDetail, Products } from './types';

export const fetchProducts = async (page = 1) => {
  const { data } = await api.get<Products>(`/products?page=${page}`);
  return data;
};

// detail
export const fetchProductById = async (productId: string) => {
  const { data } = await api.get<ProductDetail>(`/products/${productId}`);
  return data;
};
