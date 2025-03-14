import { Suspense } from 'react';
import Loading from '../loading';
import { Cart } from './components';

export default function CartPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Cart />
    </Suspense>
  );
}
