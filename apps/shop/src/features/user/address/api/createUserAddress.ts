import { USER_ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils';
import { z } from 'zod';

const addressFormSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }).max(10),
  phone: z
    .string()
    .min(1, { message: '전화번호를 입력해주세요.' })
    .max(11, { message: '전화번호는 11자리를 초과할 수 없습니다.' })
    .regex(/^[0-9]+$/, { message: '숫자만 입력해주세요.' }),
  alias: z
    .string()
    .max(10, { message: '최대 10자까지 입력할 수 있습니다.' })
    .optional(),
  zonecode: z.string().min(1, { message: '우편번호를 입력해주세요.' }),
  roadAddress: z.string().min(1, { message: '도로명주소를 입력해주세요.' }),
  extraAddress: z.string().optional(),
});

type UserAddressForm = z.infer<typeof addressFormSchema>;

const createUserAddress = async (body: UserAddressForm) =>
  await api.post<{ message: string }, UserAddressForm>(
    USER_ENDPOINTS.addresses,
    body,
  );

export { createUserAddress, type UserAddressForm, addressFormSchema };
