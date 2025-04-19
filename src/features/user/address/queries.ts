import {
  fetchDefaultUserAddress,
  fetchUserAddresses,
} from '@/features/user/address/apis';

export const addressKeys = {
  all: ['address'] as const,
  default: () => [...addressKeys.all, 'default'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export const addressQueries = {
  default: () => ({
    queryKey: addressKeys.default(),
    queryFn: fetchDefaultUserAddress,
    staleTime: 60 * 5,
    refetchOnWindowFocus: false,
  }),
  list: () => ({
    queryKey: addressKeys.list(),
    queryFn: fetchUserAddresses,
    staleTime: 60 * 5,
    refetchOnWindowFocus: false,
  }),
};
