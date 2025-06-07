import { OrderComplete, getOrderById } from '@/features/order';
import { formatDateWithTime } from '@findyourkicks/shared';

export const dynamic = 'force-static';

export default async function OrderCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getOrderById(id);

  const order = {
    ...response,
    orderDate: formatDateWithTime(response.orderDate),
  };

  return <OrderComplete order={order} />;
}
