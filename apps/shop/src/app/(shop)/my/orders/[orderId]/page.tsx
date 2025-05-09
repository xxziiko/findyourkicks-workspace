import { getOrderById } from '@/features/order';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <div>OrderDetailPage</div>;
}
