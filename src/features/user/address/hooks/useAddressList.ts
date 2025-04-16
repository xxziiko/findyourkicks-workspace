import {
  fetchUserAddresses,
  updateUserAddress,
} from '@/features/user/address/apis';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

export default function useAddressList(onClose: () => void) {
  const queryClient = useQueryClient();
  const { data: addresses } = useSuspenseQuery({
    queryKey: ['addresses'],
    queryFn: fetchUserAddresses,
  });

  const { mutate: mutateDefaultAddress } = useMutation({
    mutationFn: updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['defaultAddress'],
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
