import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';
import type { OrderStatus } from '../types';

const orderProductSchema = z.object({
  id: z.string(),
  productId: z.string(),
  title: z.string(),
  image: z.string(),
  size: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const cancellationInfoSchema = z
  .object({
    reason: z.string(),
    requestedAt: z.string(),
    status: z.enum(['requested', 'completed', 'rejected']),
  })
  .nullable();

const returnInfoSchema = z
  .object({
    returnType: z.enum(['return', 'exchange']),
    reason: z.string(),
    details: z.string().optional(),
    requestedAt: z.string(),
    status: z.enum(['requested', 'approved', 'rejected', 'completed']),
  })
  .nullable();

const orderByIdSchema = z.object({
  orderId: z.string(),
  orderDate: z.string(),
  status: z.string().transform((val) => val as OrderStatus),
  trackingNumber: z.string().nullable(),
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
  products: z.array(orderProductSchema),
  cancellationInfo: cancellationInfoSchema.optional(),
  returnInfo: returnInfoSchema.optional(),
});

type OrderByIdResponse = z.infer<typeof orderByIdSchema>;

const getOrderById = async (orderId: string) => {
  return await api
    .get<OrderByIdResponse>(`${ENDPOINTS.orders}/${orderId}`)
    .then((res) => orderByIdSchema.parse(res));
};

export { getOrderById, type OrderByIdResponse };
