import { Suspense } from 'react';
import Loading from '../loading';
import { Cart } from './_features';

export default function CartPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Cart />
    </Suspense>
  );
}
