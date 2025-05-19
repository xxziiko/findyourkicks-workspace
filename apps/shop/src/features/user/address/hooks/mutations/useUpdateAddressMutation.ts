import { updateUserAddress } from '@/features/user/address';
import { useMutation } from '@tanstack/react-query';

export function useUpdateAddressMutation() {
  return useMutation({
    mutationFn: updateUserAddress,
  });
}
