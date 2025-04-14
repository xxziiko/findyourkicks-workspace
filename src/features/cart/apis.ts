import type { CartList, CartListPayload } from '@/features/cart/types';
import { api } from '@/shared/utils/api';

export const addToCart = async ({
  body,
  userId,
}: { body: CartListPayload; userId: string }) => {
  return await api.post<CartList, CartListPayload>(
    `/cart?userId=${userId}`,
    body,
  );
};

export const fetchCartList = async (userId: string) => {
  return await api.get<CartList>(`/cart?userId=${userId}`);
};

export const updateCartQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) => {
  return await api.patch<CartList, { quantity: number }>(
    `/cart/item/${cartItemId}`,
    {
      quantity,
    },
  );
};

export const deleteCartItem = async (cartItemId: string) => {
  return await api.delete<CartList>(`/cart/item/${cartItemId}`);
};
