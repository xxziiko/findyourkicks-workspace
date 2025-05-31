import { path } from '@/shared/utils';

const ROOT_CART = '/cart';
const ROOT_USER = '/users';
const ROOT_AUTH = '/auth';

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

export const AUTH_ENDPOINTS = {
  auth: ROOT_AUTH,
  signInWithTestAccount: path(ROOT_AUTH, '/test-account'),
  signInWithGoogle: path(ROOT_AUTH, '/google'),
  signInWithKakao: path(ROOT_AUTH, '/kakao'),
  signOut: path(ROOT_AUTH, '/signout'),
} as const;
