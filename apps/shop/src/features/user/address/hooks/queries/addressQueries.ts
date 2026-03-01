import {
  fetchDefaultUserAddress,
  fetchUserAddresses,
} from '@/features/user/address';
import { queryOptions } from '@tanstack/react-query';

export const addressQueries = {
  all: () => ['address'] as const,
  default: () =>
    queryOptions({
      queryKey: [...addressQueries.all(), 'default'] as const,
      queryFn: () => fetchDefaultUserAddress(),
      refetchOnWindowFocus: false,
    }),
  list: () =>
    queryOptions({
      queryKey: [...addressQueries.all(), 'list'] as const,
      queryFn: () => fetchUserAddresses(),
      refetchOnWindowFocus: false,
    }),
};
