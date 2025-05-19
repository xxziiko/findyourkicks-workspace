import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const orderPayloadSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.string(),
});

const orderResponseSchema = z.object({
  message: z.string(),
  orderId: z.string(),
});

type OrderRequest = z.infer<typeof orderPayloadSchema>;
type OrderResponse = z.infer<typeof orderResponseSchema>;

const createOrder = async (body: OrderRequest) => {
  return await api
    .post<OrderResponse, OrderRequest>(ENDPOINTS.orders, body)
    .then((res) => orderResponseSchema.parse(res));
};

export { createOrder, type OrderRequest, type OrderResponse };
