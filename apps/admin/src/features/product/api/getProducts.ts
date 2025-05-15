import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const getResentProductsSchema = z.object({
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

type ResentProductItem = z.infer<typeof getResentProductsSchema>;

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

const getProducts = async (): Promise<ResentProductItem[]> => {
  const query = supabase
    .from('products')
    .select('*')
    .throwOnError()
    .then(handleError);

  const data = (await query) as ProductResponse[];

  return data.map(({ product_id, created_at, ...rest }) =>
    getResentProductsSchema.parse({
      id: product_id,
      createdAt: created_at,
      ...rest,
    }),
  );
};

export { getProducts, type ResentProductItem };
