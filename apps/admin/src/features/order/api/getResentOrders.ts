import { getOrders } from './getOrders';

export const getResentOrders = async (limit: number) => {
  const orders = await getOrders(limit);
  return orders;
};
