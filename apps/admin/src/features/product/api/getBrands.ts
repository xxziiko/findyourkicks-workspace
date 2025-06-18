import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { z } from 'zod';

const brandsSchema = z.object({
  brand_id: z.string(),
  name: z.string(),
});

type Brand = z.infer<typeof brandsSchema>;

const getBrands = async (): Promise<Brand[]> => {
  const data = await api.get<Brand[]>(API_PATH.brands);

  return data.map((brand) => brandsSchema.parse(brand));
};

export { getBrands, type Brand };
