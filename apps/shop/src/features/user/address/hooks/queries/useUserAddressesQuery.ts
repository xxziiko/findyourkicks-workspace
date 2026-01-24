import type { UserAddress } from '@/features/user/address';
import { addressQueries } from '@/features/user/address/hooks/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useUserAddressesQuery() {
  return useSuspenseQuery({
    ...addressQueries.list(),
    select: (data) =>
      data.filter((address): address is UserAddress =>
        Boolean(
          address?.addressId &&
            address?.address &&
            address?.address.trim() !== '' &&
            address?.receiverName,
        ),
      ),
    refetchOnWindowFocus: false,
  });
}
