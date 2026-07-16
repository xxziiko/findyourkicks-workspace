import { OrderHistoryList, orderQueries } from '@/features/order';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    orderQueries.history(1, { headers: { cookie: cookieStore.toString() } }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderHistoryList />
    </HydrationBoundary>
  );
}
