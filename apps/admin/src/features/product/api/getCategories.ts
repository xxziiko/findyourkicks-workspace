import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const categoriesSchema = z.object({
  category_id: z.string(),
  name: z.string(),
});

type Category = z.infer<typeof categoriesSchema>;

const getCategories = async (): Promise<Category[]> => {
  const data = (await supabase
    .from('categories')
    .select('*')
    .then(handleError)) as Category[];

  return data.map((category) => categoriesSchema.parse(category));
};

export { getCategories, type Category };
