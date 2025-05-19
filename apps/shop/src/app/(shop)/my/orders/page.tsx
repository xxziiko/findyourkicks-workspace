import { OrderHistoryList, orderQueries } from '@/features/order';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

export default async function MyOrdersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(orderQueries.history(1));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderHistoryList />
    </HydrationBoundary>
  );
}
