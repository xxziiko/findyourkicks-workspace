import { path } from '@/shared/utils';

const ROOT_CART = '/cart';

export const ENDPOINTS = {
  cart: ROOT_CART,
  cartItems: path(ROOT_CART, '/items'),
  cartCount: path(ROOT_CART, '/count'),
  orders: '/orders',
  orderSheets: '/order-sheets',
  payments: '/payments',
  user: '/users',
  products: '/products',
} as const;
