import {
  useSearchAddress,
  useUserAddressMutation,
} from '@/features/user/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export type AddressForm = z.infer<typeof schema>;

const schema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }).max(10),
  phone: z
    .string()
    .min(1, { message: '전화번호를 입력해주세요.' })
    .max(11, { message: '전화번호는 11자리를 초과할 수 없습니다.' })
    .regex(/^[0-9]+$/, { message: '숫자만 입력해주세요.' }),
  alias: z.string().min(1).max(10),
  zonecode: z.string().min(1),
  roadAddress: z.string().min(1),
  extraAddress: z.string().min(1),
});

export default function useAddressForm(onClose: () => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressForm>({ resolver: zodResolver(schema) });
  const { mutate: mutateUserAddress } = useUserAddressMutation();
  const { handlePostcode } = useSearchAddress(setValue);

  const onSubmit = (data: AddressForm) => {
    const formattedData = {
      ...data,
      address: `[${data.zonecode}] ${data.roadAddress} ${data.extraAddress}`,
    };

    mutateUserAddress(formattedData);
    onClose();
  };

  return { handlePostcode, register, handleSubmit, onSubmit, errors };
}
