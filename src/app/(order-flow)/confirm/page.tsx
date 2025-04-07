import { createOrder } from '@/lib/api';
import { redirect } from 'next/navigation';

export interface CreateOrderPayload {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<CreateOrderPayload>;
}) {
  const payload = await searchParams;
  const orderResponse = await createOrder(payload);

  if (orderResponse.orderId) {
    redirect(`/complete/${orderResponse.orderId}`);
  }

  return <div>결제 확인 요청 중입니다.</div>;
}
