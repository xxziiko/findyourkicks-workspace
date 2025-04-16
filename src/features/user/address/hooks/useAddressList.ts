import {
  addressKeys,
  addressQueries,
  updateUserAddress,
} from '@/features/user/address';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

export default function useAddressList(onClose: () => void) {
  const queryClient = useQueryClient();
  const { data: addresses } = useSuspenseQuery(addressQueries.list());

  const { mutate: mutateDefaultAddress } = useMutation({
    mutationFn: updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: addressKeys.default(),
      });
      onClose();
    },
  });

  const onUpdateDefaultAddress = (addressId: string) => {
    mutateDefaultAddress(addressId);
  };

  return {
    addresses,
    onUpdateDefaultAddress,
  };
}
