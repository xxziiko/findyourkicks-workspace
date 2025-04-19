import type { CartList, CartListPayload } from '@/features/cart/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const addToCart = async (body: CartListPayload) => {
  return await api.post<CartList, CartListPayload>(ENDPOINTS.cartItems, body);
};

export const fetchCartList = async () => {
  return await api.get<CartList>(ENDPOINTS.cartItems);
};

export const updateCartQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) => {
  return await api.patch<CartList, { quantity: number }>(
    `${ENDPOINTS.cartItems}/${cartItemId}`,
    {
      quantity,
    },
  );
};

export const deleteCartItem = async (cartItemId: string) => {
  return await api.delete<CartList>(`${ENDPOINTS.cartItems}/${cartItemId}`);
};
