import { Complete, getOrderById } from '@/features/order';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dynamic = 'force-static';

export default async function CompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getOrderById(id);

  const order = {
    ...response,
    orderDate: format(response.orderDate, 'yyyy-MM-dd HH:mm:ss', {
      locale: ko,
    }),
  };

  return <Complete order={order} />;
}
