import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const orderByIdSchema = z.object({
  orderId: z.string(),
  orderDate: z.string(),
  payment: z.object({
    paymentMethod: z.string(),
    paymentEasypayProvider: z.string(),
    amount: z.number(),
    orderName: z.string(),
  }),
  address: z.object({
    alias: z.string().optional(),
    receiverName: z.string(),
    receiverPhone: z.string(),
    address: z.string(),
    message: z.string(),
  }),
});

type OrderByIdResponse = z.infer<typeof orderByIdSchema>;

const getOrderById = async (orderId: string) => {
  return await api
    .get<OrderByIdResponse>(`${ENDPOINTS.orders}/${orderId}`)
    .then((res) => orderByIdSchema.parse(res));
};

export { getOrderById, type OrderByIdResponse };
