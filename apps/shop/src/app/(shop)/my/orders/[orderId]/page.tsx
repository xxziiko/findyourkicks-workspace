import { OrderDetail, getOrderById } from '@/features/order';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  return <OrderDetail order={order} />;
}
