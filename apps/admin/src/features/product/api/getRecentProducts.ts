import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const recentProductsSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
});

type ProductItem = z.infer<typeof recentProductsSchema>;

interface ProductResponse {
  product_id: string;
  title: string;
  created_at: string;
}

const getRecentProducts = async (limit: number) => {
  let query = supabase
    .from('products')
    .select('product_id, title, created_at')
    .order('created_at', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const data = (await query
    .throwOnError()
    .then(handleError)) as ProductResponse[];

  return data.map(({ product_id, title, created_at }) =>
    recentProductsSchema.parse({
      id: product_id,
      title,
      createdAt: created_at,
    }),
  );
};

export { getRecentProducts, type ProductItem };
