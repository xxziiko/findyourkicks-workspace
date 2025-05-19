import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const orderProductSchema = z.object({
  id: z.string(),
  productId: z.string(),
  size: z.string(),
  quantity: z.number(),
  price: z.number(),
  title: z.string(),
  image: z.string(),
});

const orderHistoryItemSchema = z.object({
  orderId: z.string(),
  orderDate: z.string(),
  products: z.array(orderProductSchema),
});

const orderHistorySchema = z.object({
  orders: z.array(orderHistoryItemSchema),
  lastPage: z.number(),
  currentPage: z.number(),
  hasNext: z.boolean(),
});

type OrderHistory = z.infer<typeof orderHistorySchema>;
type OrderProductItem = z.infer<typeof orderProductSchema>;

const fetchOrderHistory = async (
  page = 1,
  options?: { headers?: Record<string, string> },
) => {
  return await api
    .get<OrderHistory>(`${ENDPOINTS.orders}?page=${page}`, options)
    .then((res) => orderHistorySchema.parse(res));
};

export { fetchOrderHistory, type OrderHistory, type OrderProductItem };
