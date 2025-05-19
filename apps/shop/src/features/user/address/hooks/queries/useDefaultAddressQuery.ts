import type { UserAddress } from '@/features/user/address';
import { addressQueries } from '@/features/user/address/hooks/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useDefaultAddressQuery({
  deliveryAddress,
}: {
  deliveryAddress: UserAddress;
}) {
  return useSuspenseQuery({
    ...addressQueries.default(),
    refetchOnWindowFocus: false,
    initialData: deliveryAddress,
  });
}
