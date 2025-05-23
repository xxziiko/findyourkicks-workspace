import { path } from '@findyourkicks/shared';

const ROOT_PRODUCTS = '/products';
const ROOT_ORDERS = '/orders';

export const PATH = {
  default: '/',
  login: '/login',
  products: ROOT_PRODUCTS,
  newProduct: path(ROOT_PRODUCTS, '/new'),
  orders: ROOT_ORDERS,
} as const;
