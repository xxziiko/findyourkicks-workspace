import { Checkout } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import { addressQueries } from '@/features/user/address/hooks/queries';
import { ENDPOINTS } from '@/shared/constants';
import { api, getCookieString } from '@/shared/utils';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(addressQueries.default());

  const orderSheet = await getOrderSheetBy(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <Checkout orderSheet={orderSheet} />
      </Suspense>
    </HydrationBoundary>
  );
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
