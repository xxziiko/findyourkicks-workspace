import { Checkout } from '@/features/order';
import { fetchOrderSheetById } from '@/features/order-sheet/apis';
import { redirect } from 'next/navigation';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderSheet = await fetchOrderSheetById(id);

  if (!orderSheet.orderSheetId) redirect('/cart');

  return <Checkout orderSheet={orderSheet} />;
}
