import { userAddressSchema } from '@/features/user/address';
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

export const orderSheetByIdSchema = z.object({
  orderSheetId: z.string(),
  orderSheetItems: z.array(orderProductSchema),
  deliveryAddress: userAddressSchema,
});

export type OrderSheetByIdResponse = z.infer<typeof orderSheetByIdSchema>;
