import { Checkout } from '@/features/order';
import { fetchOrderSheetById } from '@/features/order-sheet';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orderSheet = await fetchOrderSheetById(id);

  return <Checkout orderSheet={orderSheet} />;
}
