import Loading from '@/app/loading';
import { Suspense } from 'react';
import Detail from './Detail';

export default async function DetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Detail />
    </Suspense>
  );
}
