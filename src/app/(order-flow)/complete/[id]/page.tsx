import { fetchOrder } from '@/lib/api';
import Complete from './Complete';

export default async function CompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchOrder(id);

  return <Complete order={order} />;
}
