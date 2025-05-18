import {
  fetchDefaultUserAddress,
  fetchUserAddresses,
} from '@/features/user/address';
import { createQueries as createAddressQueries } from '@findyourkicks/shared';

export const addressQueries = createAddressQueries('address', {
  default: () => ({
    queryFn: () => fetchDefaultUserAddress(),
  }),
  list: () => ({
    queryFn: () => fetchUserAddresses(),
  }),
});
