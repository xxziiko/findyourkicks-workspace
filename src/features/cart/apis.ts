import type { CartList, CartListPayload } from '@/features/cart/types';
import { api } from '@/shared/utils/api';

export const addToCart = async ({
  body,
  userId,
}: { body: CartListPayload; userId: string }) => {
  const { data } = await api.post<CartList, CartListPayload>(
    `/cart?userId=${userId}`,
    body,
  );

  return data;
};

export const fetchCartList = async (userId: string) => {
  const { data } = await api.get<CartList>(`/cart?userId=${userId}`);

  return data;
};

export const updateCartQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) => {
  const { data } = await api.patch<CartList, { quantity: number }>(
    `/cart/item/${cartItemId}`,
    {
      quantity,
    },
  );
  return data;
};

export const deleteCartItem = async (cartItemId: string) => {
  const { data } = await api.delete<CartList>(`/cart/item/${cartItemId}`);
  return data;
};
