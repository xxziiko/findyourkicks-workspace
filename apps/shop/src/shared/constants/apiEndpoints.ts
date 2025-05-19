import { path } from '@/shared/utils';

const ROOT_CART = '/cart';
const ROOT_USER = '/users';

export const ENDPOINTS = {
  cart: ROOT_CART,
  cartItems: path(ROOT_CART, '/items'),
  cartCount: path(ROOT_CART, '/count'),
  orders: '/orders',
  orderSheets: '/order-sheets',
  payments: '/payments',
  products: '/products',
} as const;

export const USER_ENDPOINTS = {
  user: ROOT_USER,
  addresses: path(ROOT_USER, '/addresses'),
  addressDefault: path(ROOT_USER, '/addresses/default'),
} as const;
