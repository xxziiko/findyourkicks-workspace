import { z } from 'zod';

const userAddressSchema = z.object({
  addressId: z.string().min(1),
  alias: z.string().min(1),
  receiverName: z.string().min(1),
  receiverPhone: z.string().min(1),
  address: z.string().min(1),
  message: z.string().default(''),
  isDefault: z.boolean().default(false),
});

type UserAddress = z.infer<typeof userAddressSchema>;

type UserAddressNullable = UserAddress | null;

type UserAddresses = UserAddress[];

export {
  userAddressSchema,
  type UserAddress,
  type UserAddressNullable,
  type UserAddresses,
};
