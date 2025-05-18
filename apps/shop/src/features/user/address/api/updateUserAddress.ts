import type { UserAddress } from '@/features/user/address';
import { USER_ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils';

export const updateUserAddress = async (addressId: string) =>
  await api.patch<{ message: string }, UserAddress>(
    `${USER_ENDPOINTS.addresses}/${addressId}`,
  );
