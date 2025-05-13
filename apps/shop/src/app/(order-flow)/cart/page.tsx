import { Cart } from '@/features/cart';
import { Suspense } from 'react';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Cart />
    </Suspense>
  );
}
