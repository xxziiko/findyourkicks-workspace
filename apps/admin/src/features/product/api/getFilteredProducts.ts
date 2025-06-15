import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
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
  const data = await supabase
    .rpc('get_filtered_products', {
      p_search: search,
      p_status: status,
      p_category: category,
      p_brand: brand,
      p_start_date: new Date(period?.startDate ?? '2025-01-01'),
      p_end_date: new Date(period?.endDate ?? new Date()),
      p_page: page ?? 1,
      p_page_size: 30,
    })
    .then(handleError);

  return data;
};

export { getFilteredProducts, type Product, type Products };
