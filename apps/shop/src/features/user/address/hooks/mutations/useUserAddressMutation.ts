import { createUserAddress } from '@/features/user/address';
import { useMutation } from '@tanstack/react-query';

export default function useUserAddressMutation() {
  return useMutation({
    mutationFn: createUserAddress,
  });
}
