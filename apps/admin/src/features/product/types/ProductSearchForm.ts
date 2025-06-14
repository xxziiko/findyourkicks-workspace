import { z } from 'zod';

const productSearchFormSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  period: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

type ProductSearchForm = z.infer<typeof productSearchFormSchema>;

export { productSearchFormSchema, type ProductSearchForm };
