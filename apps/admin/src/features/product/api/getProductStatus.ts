import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const productStatusSchema = z.object({
  all: z.number(),
  pending: z.number(),
  selling: z.number(),
  soldout: z.number(),
});

type ProductStatus = z.infer<typeof productStatusSchema>;

const getProductStatus = async (): Promise<ProductStatus> => {
  const data = (await supabase
    .rpc('get_all_products_status')
    .then(handleError)) as ProductStatus;

  return productStatusSchema.parse(data);
};

export { getProductStatus, type ProductStatus };
