import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  brand: z.string({ required_error: '브랜드를 선택해주세요.' }),
  productName: z.string().min(1, '상품명을 입력해주세요.'),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  detail: z.string().min(1, '상품 상세 정보를 입력해주세요.'),
  sizes: z.array(z.object({ size: z.string(), stock: z.number() })),
  images: z.array(z.string()).min(1, '상품 이미지를 추가해주세요.'),
});

export type FormSchema = z.infer<typeof formSchema>;

export function useProductRegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    errors,
    getValues,
  };
}
