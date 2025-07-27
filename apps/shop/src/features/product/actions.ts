import type { ProductDetail } from '@/features/product/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { createClient } from '@/shared/utils/supabase/client';

type Product = {
  productid: string;
  brand: string;
  title: string;
  price: number;
  image: string;
};

const supabase = createClient();

export const fetchProducts = async (page = 1, brand?: string) => {
  const { data, error } = await supabase.rpc('get_products', {
    p_page: page,
    p_brand: brand || null,
  });

  if (error) {
    console.error('RPC Error:', error);
    return [];
  }

  return data.map(({ productid, ...rest }: Product) => ({
    productId: productid,
    ...rest,
  }));
};

// detail
export const fetchProductById = async (productId: string) => {
  return await api.get<ProductDetail>(`${ENDPOINTS.products}/${productId}`);
};

export const fetchProductsByBrand = async (brand: string) => {
  return await fetchProducts(1, brand);
};
