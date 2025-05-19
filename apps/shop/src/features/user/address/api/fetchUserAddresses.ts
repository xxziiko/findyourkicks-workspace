import type { UserAddresses } from '@/features/user/address';
import { USER_ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils';

export const fetchUserAddresses = async () =>
  await api.get<UserAddresses>(USER_ENDPOINTS.addresses);
