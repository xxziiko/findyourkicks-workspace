import { type OrderRequest, createOrder } from '@/features/order';
import { PATH } from '@/shared/constants';
import { redirect } from 'next/navigation';

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<OrderRequest>;
}) {
  const payload = await searchParams;
  const response = await createOrder(payload);

  if (response.orderId) {
    redirect(`${PATH.complete}/${response.orderId}`);
  }

  return <div>결제 확인 요청 중입니다.</div>;
}
