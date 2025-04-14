import { createOrder } from '@/features/order/apis';
import type { OrderRequest } from '@/features/order/types';
import { redirect } from 'next/navigation';

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<OrderRequest>;
}) {
  const payload = await searchParams;
  const response = await createOrder(payload);

  if (response.orderId) {
    redirect(`/complete/${response.orderId}`);
  }

  return <div>결제 확인 요청 중입니다.</div>;
}
