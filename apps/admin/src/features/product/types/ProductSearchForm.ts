import { z } from 'zod';

const productSearchFormSchema = z
  .object({
    search: z.string().optional(),
    status: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    period: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    page: z.number().optional(),
  })
  .refine(
    (data) => {
      // category가 선택되었을 때만 brand가 필수
      if (data.category && data.category !== '카테고리를 선택해주세요.') {
        return data.brand && data.brand !== '브랜드를 선택해주세요.';
      }
      return true;
    },
    {
      message: '카테고리를 선택한 경우 브랜드도 선택해주세요.',
      path: ['brand'],
    },
  );

type ProductSearchForm = z.infer<typeof productSearchFormSchema>;

export { productSearchFormSchema, type ProductSearchForm };
