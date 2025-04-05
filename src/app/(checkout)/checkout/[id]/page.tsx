import { fetchOrderSheet } from '@/lib/api';
import { redirect } from 'next/navigation';
import Checkout from './Checkout';

export const dynamic = 'force-static';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderSheet = await fetchOrderSheet(id);

  if (!orderSheet.orderSheetId) redirect('/cart');

  return <Checkout id={id} orderSheet={orderSheet} />;
}
