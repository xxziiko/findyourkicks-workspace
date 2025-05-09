import {
  fetchDefaultUserAddress,
  fetchUserAddresses,
} from '@/features/user/address/apis';
import type { UserAddress } from '@/features/user/address/types';

export const addressKeys = {
  all: ['address'] as const,
  default: () => [...addressKeys.all, 'default'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export const addressQueries = {
  default: (deliveryAddress: UserAddress) => ({
    queryKey: addressKeys.default(),
    queryFn: fetchDefaultUserAddress,
    refetchOnWindowFocus: false,
    initialData: deliveryAddress,
  }),
  list: () => ({
    queryKey: addressKeys.list(),
    queryFn: fetchUserAddresses,
    staleTime: 60 * 5,
    refetchOnWindowFocus: false,
  }),
};
