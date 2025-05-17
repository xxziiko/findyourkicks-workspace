import { addressQueries } from '@/features/user/address/hooks/queries';
import type { UserAddress } from '@/features/user/address/types';
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
