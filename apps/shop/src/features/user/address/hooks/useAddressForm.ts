import {
  addressKeys,
  useSearchAddress,
  useUserAddressMutation,
} from '@/features/user/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
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
  })
  .required();

export type AddressForm = z.infer<typeof schema>;

export default function useAddressForm(onClose: () => void) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressForm>({ resolver: zodResolver(schema) });
  const { mutate: mutateUserAddress } = useUserAddressMutation();
  const { handlePostcode } = useSearchAddress(setValue);

  const handleCreateUserAddress = (data: AddressForm) => {
    const { zonecode, roadAddress, extraAddress, name, phone, alias } = data;

    const formattedData = {
      name,
      phone,
      alias,
      address: `[${zonecode}] ${roadAddress} ${extraAddress}`,
    };

    mutateUserAddress(formattedData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: addressKeys.list() });
        queryClient.invalidateQueries({ queryKey: addressKeys.default() });
        onClose();
      },
    });
  };

  return {
    handlePostcode,
    register,
    handleSubmit,
    handleCreateUserAddress,
    errors,
  };
}
