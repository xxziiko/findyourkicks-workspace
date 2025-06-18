import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
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
  const data = await api.get<ProductResponse[]>(API_PATH.productsRecent, {
    params: { limit },
  });

  return data.map(({ product_id, title, created_at }) =>
    recentProductsSchema.parse({
      id: product_id,
      title,
      createdAt: created_at,
    }),
  );
};

export { getRecentProducts, type ProductItem };
