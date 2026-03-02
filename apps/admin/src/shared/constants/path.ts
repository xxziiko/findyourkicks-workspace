import { path } from '@findyourkicks/shared';

const ROOT_PRODUCTS = '/products';
const ROOT_ORDERS = '/orders';
const ROOT_RETURNS = '/returns';

export const PATH = {
  default: '/',
  login: '/login',
  products: ROOT_PRODUCTS,
  newProduct: path(ROOT_PRODUCTS, '/new'),
  orders: ROOT_ORDERS,
  returns: ROOT_RETURNS,
} as const;
