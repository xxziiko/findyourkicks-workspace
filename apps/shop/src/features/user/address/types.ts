import { z } from 'zod';

const userAddressSchema = z.object({
  addressId: z.string(),
  alias: z.string(),
  receiverName: z.string(),
  receiverPhone: z.string(),
  address: z.string(),
  message: z.string(),
  isDefault: z.boolean().optional(),
});

type UserAddress = z.infer<typeof userAddressSchema>;

type UserAddresses = UserAddress[];

export { userAddressSchema, type UserAddress, type UserAddresses };
