import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const statusMap = {
  paid: '결제완료',
} as const;

const recentOrdersSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  orderDate: z.string(),
  orderStatus: z.string(),
});

type RecentOrderItem = z.infer<typeof recentOrdersSchema>;

interface RecentOrderResponse {
  order_item_id: string;
  order_id: string;
  order_date: string;
  order_status: keyof typeof statusMap;
}

const getRecentOrders = async (limit: number) => {
  let query = supabase
    .from('orders_view')
    .select('order_item_id, order_id, order_date, order_status')
    .order('order_date', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const data = (await query.then(handleError)) as RecentOrderResponse[];

  return data.map((order) =>
    recentOrdersSchema.parse({
      id: order.order_item_id,
      orderId: order.order_id,
      orderDate: order.order_date,
      orderStatus: statusMap[order.order_status],
    }),
  );
};

export { getRecentOrders, type RecentOrderItem };
