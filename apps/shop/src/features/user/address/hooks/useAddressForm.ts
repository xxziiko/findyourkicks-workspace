import {
  type UserAddressForm,
  addressFormSchema,
  useSearchAddress,
} from '@/features/user/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function useAddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserAddressForm>({ resolver: zodResolver(addressFormSchema) });

  const { handlePostcode } = useSearchAddress(setValue);

  return {
    handlePostcode,
    register,
    handleSubmit,
    errors,
  };
}
