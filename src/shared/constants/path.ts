export const PATH = {
  home: '/',
  cart: '/cart',
  checkout: '/checkout',
  complete: '/complete',
  confirm: '/confirm',
  login: '/login',
  product: '/products',
  my: '/my',
  myOrders: '/my/orders',
} as const;

export const AUTH_PATHS = [
  PATH.cart,
  PATH.checkout,
  PATH.complete,
  PATH.confirm,
] as const;
