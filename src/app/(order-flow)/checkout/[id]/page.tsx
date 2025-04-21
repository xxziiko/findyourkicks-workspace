import { Checkout } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import { ENDPOINTS } from '@/shared/constants';
import { api, getCookieString } from '@/shared/utils';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orderSheet = await getOrderSheetBy(id);

  return <Checkout orderSheet={orderSheet} />;
}

async function getOrderSheetBy(id: string) {
  const cookieString = await getCookieString();
  const orderSheet = await api.get<OrderSheetByIdResponse>(
    `${ENDPOINTS.orderSheets}/${id}`,
    {
      headers: {
        Cookie: cookieString,
      },
    },
  );
  return orderSheet;
}
