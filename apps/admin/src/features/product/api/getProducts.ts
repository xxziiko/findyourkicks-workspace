import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';
import type { ProductSearchForm } from '../types';

const productsSchema = z.object({
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

type Product = z.infer<typeof productsSchema>;

interface ProductResponse {
  id: string;
  product_id: string;
  title: string;
  created_at: string;
  price: number;
  size: string;
  stock: number;
  brand: string;
  category: string;
  description: string;
  image: string;
  status: string;
}

const getFilteredProducts = async (
  filters: ProductSearchForm,
): Promise<Product[]> => {
  const { search, status, category, brand, period } = filters;
  const data = (await supabase
    .rpc('get_filtered_products_by_name', {
      search,
      status,
      category,
      brand,
      start_date: period.startDate,
      end_date: period.endDate,
    })
    .then(handleError)) as ProductResponse[];

  return data.map((product) => productsSchema.parse(product));
};

export { getFilteredProducts, type Product };
