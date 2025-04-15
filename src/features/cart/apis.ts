import type { CartList, CartListPayload } from '@/features/cart/types';
import { api } from '@/shared/utils/api';

export const addToCart = async (body: CartListPayload) => {
  return await api.post<CartList, CartListPayload>('/cart/items', body);
};

export const fetchCartList = async () => {
  return await api.get<CartList>('/cart/items');
};

export const updateCartQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) => {
  return await api.patch<CartList, { quantity: number }>(
    `/cart/items/${cartItemId}`,
    {
      quantity,
    },
  );
};

export const deleteCartItem = async (cartItemId: string) => {
  return await api.delete<CartList>(`/cart/items/${cartItemId}`);
};
