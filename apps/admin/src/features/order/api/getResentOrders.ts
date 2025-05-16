import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const statusMap = {
  paid: '결제완료',
} as const;

const resentOrdersSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  orderDate: z.string(),
  orderStatus: z.string(),
});

type ResentOrderItem = z.infer<typeof resentOrdersSchema>;

interface ResentOrderResponse {
  order_item_id: string;
  order_id: string;
  order_date: string;
  order_status: keyof typeof statusMap;
}

const getResentOrders = async (limit: number) => {
  let query = supabase
    .from('orders_view')
    .select('order_item_id, order_id, order_date, order_status')
    .order('order_date', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const data = (await query
    .throwOnError()
    .then(handleError)) as ResentOrderResponse[];

  return data.map((order) =>
    resentOrdersSchema.parse({
      id: order.order_item_id,
      orderId: order.order_id,
      orderDate: order.order_date,
      orderStatus: statusMap[order.order_status],
    }),
  );
};

export { getResentOrders, type ResentOrderItem };
