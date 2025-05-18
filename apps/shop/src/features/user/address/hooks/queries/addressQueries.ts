import {
  fetchDefaultUserAddress,
  fetchUserAddresses,
} from '@/features/user/address';
import { createQueries as createAddressQueries } from '@findyourkicks/shared';

export const addressKeys = {
  all: ['address'] as const,
  default: () => [...addressKeys.all, 'default'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export const addressQueries = createAddressQueries('address', {
  default: () => ({
    queryFn: () => fetchDefaultUserAddress(),
  }),
  list: () => ({
    queryFn: () => fetchUserAddresses(),
  }),
});
