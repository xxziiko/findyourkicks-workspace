import { fetchOrderSheetById } from '@/features/order-sheet/apis';
import { redirect } from 'next/navigation';
import Checkout from './Checkout';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderSheet = await fetchOrderSheetById(id);

  if (!orderSheet.orderSheetId) redirect('/cart');

  return <Checkout orderSheet={orderSheet} />;
}
