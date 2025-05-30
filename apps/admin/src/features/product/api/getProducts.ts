import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const getRecentProductsSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  createdAt: z.string(),
});

type RecentProductItem = z.infer<typeof getRecentProductsSchema>;

interface ProductResponse {
  product_id: string;
  title: string;
  created_at: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  description: string;
  image: string;
}

const getProducts = async (): Promise<RecentProductItem[]> => {
  const query = supabase.from('products').select('*').then(handleError);

  const data = (await query) as ProductResponse[];

  return data.map(({ product_id, created_at, ...rest }) =>
    getRecentProductsSchema.parse({
      id: product_id,
      createdAt: created_at,
      ...rest,
    }),
  );
};

export { getProducts, type RecentProductItem };
