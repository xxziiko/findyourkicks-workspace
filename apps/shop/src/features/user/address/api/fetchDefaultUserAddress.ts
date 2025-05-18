import type { UserAddress } from '@/features/user/address';
import { USER_ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils';

export const fetchDefaultUserAddress = async () =>
  await api.get<UserAddress>(USER_ENDPOINTS.addressDefault);
