import { fetchDefaultUserAddress, fetchUserAddresses } from './apis';
import type { UserAddress } from './types';

export const addressKeys = {
  all: ['address'] as const,
  default: () => [...addressKeys.all, 'default'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export const addressQueries = {
  default: (initialAddress: UserAddress) => ({
    queryKey: addressKeys.default(),
    queryFn: fetchDefaultUserAddress,
    initialData: initialAddress,
    staleTime: 60 * 5,
  }),
  list: () => ({
    queryKey: addressKeys.list(),
    queryFn: fetchUserAddresses,
    staleTime: 60 * 5,
  }),
};
