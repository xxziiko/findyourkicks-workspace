import { path } from '@/shared/utils';

const ROOT_MY = '/my';

export const PATH = {
  home: '/',
  cart: '/cart',
  checkout: '/checkout',
  complete: '/complete',
  confirm: '/confirm',
  login: '/login',
  product: '/products',
  my: ROOT_MY,
  myOrders: path(ROOT_MY, '/orders'),
} as const;

export const AUTH_PATHS = [
  PATH.cart,
  PATH.checkout,
  PATH.complete,
  PATH.confirm,
  PATH.my,
  PATH.myOrders,
] as const;
