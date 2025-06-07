import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const brandsSchema = z.object({
  brand_id: z.string(),
  name: z.string(),
});

type Brand = z.infer<typeof brandsSchema>;

const getBrands = async (): Promise<Brand[]> => {
  const data = (await supabase
    .from('brands')
    .select('*')
    .then(handleError)) as Brand[];

  return data.map((brand) => brandsSchema.parse(brand));
};

export { getBrands, type Brand };
