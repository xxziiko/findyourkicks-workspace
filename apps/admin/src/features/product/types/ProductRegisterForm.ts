import { z } from 'zod';

const registerFormSchema = z.object({
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  brand: z.string({ required_error: '브랜드를 선택해주세요.' }),
  productName: z.string().min(1, { message: '상품명을 입력해주세요.' }),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  description: z.string().min(1, { message: '상품 상세 정보를 입력해주세요.' }),
  images: z
    .array(z.string())
    .min(1, { message: '상품 이미지를 추가해주세요.' }),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1),
        stock: z.number().refine((val) => val > 0),
      }),
    )
    .min(1, { message: '사이즈를 선택해주세요.' }),
  status: z.enum(['selling', 'pending'], {
    required_error: '상품 개시 상태를 선택해주세요.',
  }),
});

type ProductRegisterForm = z.infer<typeof registerFormSchema>;

export { registerFormSchema, type ProductRegisterForm };
