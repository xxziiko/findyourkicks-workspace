import { Cart, cartQueries } from '@/features/cart';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(cartQueries.list());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <Cart />
      </Suspense>
    </HydrationBoundary>
  );
}
