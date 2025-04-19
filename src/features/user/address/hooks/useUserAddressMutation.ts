import { addressKeys, createUserAddress } from '@/features/user/address';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUserAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: addressKeys.default() });
    },
  });
}
