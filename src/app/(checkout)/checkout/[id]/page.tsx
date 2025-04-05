import { fetchOrderSheet } from '@/lib/api';
import { redirect } from 'next/navigation';
import Checkout from './Checkout';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderSheet = await fetchOrderSheet(id);

  if (!orderSheet) redirect('/cart');

  return <Checkout id={id} orderSheet={orderSheet} />;
}
