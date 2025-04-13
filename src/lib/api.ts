import type { AddressFormData } from '@/app/(order-flow)/_features/useAddressForm';
import type { RequestPaymentsPayload } from '@/app/(order-flow)/checkout/[id]/useCheckout';
import type { CreateOrderPayload } from '@/app/(order-flow)/confirm/page';
import type { CartItem } from '@/app/api/cart/route';
import type { OrderSheetResponse } from '@/app/api/checkout/[id]/route';
import type { OrderSheetItemPayload } from '@/app/api/checkout/route';
interface RawProduct {
  product_id: string;
  title: string;
  price: number;
  image: string;

  brand: {
    name: string;
  } | null;

  category: {
    name: string;
  } | null;
}
export interface AddCartRequest {
  product_id: string;
  size: string;
  quantity: number;
  price: number;
}
[];

export const fetchProducts = async (page = 1): Promise<RawProduct[]> => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`,
    {
      next: { revalidate: 3600 * 2 },
    },
  ).then((res) => res.json());
  return data;
};

// detail
export const fetchProductById = async (productId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
  ).then((res) => res.json());

// login
export const signInWithGoogle = async (next = '/') =>
  await fetch(`/api/auth/google?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signInWithKakao = async (next = '/') =>
  await fetch(`/api/auth/kakao?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signOutUser = async () =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
    method: 'POST',
  });

// cart
export const addToCart = async ({
  body,
  userId,
}: { body: AddCartRequest[]; userId: string }) =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart?userId=${userId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const fetchCartItems = async (userId: string): Promise<CartItem[]> =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart?userId=${userId}`,
  ).then((res) => res.json());

export const updateCartQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/item/${cartItemId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    },
  );

export const deleteCartItem = async (cartItemId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/item/${cartItemId}`,
    {
      method: 'DELETE',
    },
  );

// checkout
export const createOrderSheet = async ({
  userId,
  body,
}: {
  userId: string;
  body: OrderSheetItemPayload[];
}): Promise<OrderSheetResponse> =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
    method: 'POST',
    body: JSON.stringify({ userId, body }),
  }).then((res) => res.json());

export const fetchOrderSheet = async (orderSheetId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/${orderSheetId}`,
  ).then((res) => res.json());

export const requestPayments = async (payload: RequestPaymentsPayload) =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/payments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<{ message: string; orderId: string }> =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json());

//address
export const createUserAddress = async (payload: AddressFormData) =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const fetchUserAddresses = async () =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses`).then(
    (res) => res.json(),
  );

export const fetchDefaultUserAddress = async () =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses/default`,
  ).then((res) => res.json());

export const updateUserAddress = async (addressId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses/${addressId}`,
    {
      method: 'PATCH',
    },
  ).then((res) => res.json());

export const fetchOrder = async (orderId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/complete/${orderId}`,
  ).then((res) => res.json());
