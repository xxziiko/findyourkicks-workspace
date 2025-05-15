import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const getOrderSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  orderDate: z.string(),
  orderStatus: z.string(),
});

type OrderItem = z.infer<typeof getOrderSchema>;

type OrderResponse = {
  order_item_id: string;
  order_id: string;
  order_date: string;
  order_status: keyof typeof statusMap;
};

const statusMap = {
  paid: '결제완료',
} as const;

const getOrders = async (limit?: number): Promise<OrderItem[]> => {
  let query = supabase
    .from('orders_view')
    .select('order_item_id, order_id, order_date, order_status')
    .order('order_date', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const data = (await query
    .throwOnError()
    .then(handleError)) as OrderResponse[];

  return data.map((order) =>
    getOrderSchema.parse({
      id: order.order_item_id,
      orderId: order.order_id,
      orderDate: order.order_date,
      orderStatus: statusMap[order.order_status],
    }),
  );
};

export { getOrders, type OrderItem };
