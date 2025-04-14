import { api } from '@/shared/utils/api';
import type { UserAddress, UserAddressRequest } from './types';

export const createUserAddress = async (body: UserAddressRequest) =>
  await api.post<{ message: string }, UserAddressRequest>(
    '/users/addresses',
    body,
  );

export const fetchUserAddresses = async () =>
  await api.get<UserAddress[]>('/users/addresses');

export const fetchDefaultUserAddress = async () =>
  await api.get<UserAddress>('/users/addresses/default');

export const updateUserAddress = async (addressId: string) =>
  await api.patch<{ message: string }, UserAddress>(
    `/users/addresses/${addressId}`,
  );
