import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const orderSheetSchema = z.object({
  id: z.string(),
  productId: z.string(),
  size: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const orderSheetResponseSchema = z.object({
  orderSheetId: z.string(),
});

type OrderSheet = z.infer<typeof orderSheetSchema>;

const createOrderSheet = async (body: OrderSheet[]) => {
  return await api
    .post<{ orderSheetId: string }, OrderSheet[]>(ENDPOINTS.orderSheets, body)
    .then((res) => orderSheetResponseSchema.parse(res));
};

export { createOrderSheet, type OrderSheet };
