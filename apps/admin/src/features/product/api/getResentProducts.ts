import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const getResentProductsSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
});

type ProductItem = z.infer<typeof getResentProductsSchema>;

interface ProductResponse {
  product_id: string;
  title: string;
  created_at: string;
}

const getResentProducts = async (limit: number) => {
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
    getResentProductsSchema.parse({
      id: product_id,
      title,
      createdAt: created_at,
    }),
  );
};

export { getResentProducts, type ProductItem };
