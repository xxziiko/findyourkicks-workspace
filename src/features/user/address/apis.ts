import { api } from '@/shared/utils/api';
import type { UserAddress, UserAddressRequest } from './types';

export const createUserAddress = async (body: UserAddressRequest) =>
  await api.post<{ message: string }, UserAddressRequest>(
    '/users/addresses',
    body,
  );

export const fetchUserAddresses = async () => {
  const { data } = await api.get<UserAddress[]>('/users/addresses');
  return data;
};

export const fetchDefaultUserAddress = async () => {
  const { data } = await api.get<UserAddress>('/users/addresses/default');
  return data;
};

export const updateUserAddress = async (addressId: string) =>
  await api.patch<{ message: string }, UserAddress>(
    `/users/addresses/${addressId}`,
  );
