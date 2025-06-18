import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { z } from 'zod';

const categoriesSchema = z.object({
  category_id: z.string(),
  name: z.string(),
});

type Category = z.infer<typeof categoriesSchema>;

const getCategory = async (): Promise<Category[]> => {
  const data = await api.get<Category[]>(API_PATH.categories);

  return data.map((category) => categoriesSchema.parse(category));
};

export { getCategory, type Category };
