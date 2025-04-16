import { Complete } from '@/features/order';
import { getOrderById } from '@/features/order/apis';

export default async function CompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  return <Complete order={order} />;
}
