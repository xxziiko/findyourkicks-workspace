import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { z } from 'zod';

const productStatusSchema = z.object({
  all: z.number(),
  pending: z.number(),
  selling: z.number(),
  soldout: z.number(),
});

type ProductStatus = z.infer<typeof productStatusSchema>;

const getProductStatus = async (): Promise<ProductStatus> => {
  const data = await api.get<ProductStatus>(API_PATH.productsStatus);

  return productStatusSchema.parse(data);
};

export { getProductStatus, type ProductStatus };
