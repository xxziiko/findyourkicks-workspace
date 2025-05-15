import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const statusMap = {
  paid: '결제완료',
} as const;

const getOrdersSchema = z.object({});

type OrderItem = z.infer<typeof getOrdersSchema>;

// TODO:
const getOrders = async () => {
  const query = supabase
    .from('orders_view')
    .select('*')
    .throwOnError()
    .then(handleError);

  const data = await query;

  return data.map(({ order_status, ...order }) =>
    getOrdersSchema.parse({
      ...order,
      orderStatus: statusMap[order_status as keyof typeof statusMap],
    }),
  );
};

export { getOrders, type OrderItem };
