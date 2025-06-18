import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { z } from 'zod';
import type { ProductSearchForm } from '../types';

const productSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  title: z.string(),
  price: z.number(),
  size: z.string(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  created_at: z.string(),
  status: z.string(),
});

// TODO: parse 필요
const productsSchema = z.object({
  list: z.array(productSchema),
  total: z.number(),
  current_page: z.number(),
  last_page: z.number(),
});

type Product = z.infer<typeof productSchema>;
type Products = z.infer<typeof productsSchema>;

const getFilteredProducts = async (
  params: Partial<ProductSearchForm>,
): Promise<Products> => {
  const { search, status, category, brand, period, page } = params;
  const data = await api.get(API_PATH.productsFiltered, {
    params: {
      search,
      status,
      category,
      brand,
      period,
      page,
    },
  });

  return productsSchema.parse(data);
};

export { getFilteredProducts, type Product, type Products };
