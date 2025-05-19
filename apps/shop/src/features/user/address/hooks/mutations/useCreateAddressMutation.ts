import { createUserAddress } from '@/features/user/address';
import { useMutation } from '@tanstack/react-query';

export function useCreateAddressMutation() {
  return useMutation({
    mutationFn: createUserAddress,
  });
}
