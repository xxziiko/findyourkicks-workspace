import Loading from '@/app/loading';
import { Suspense } from 'react';
import { Detail } from './_features';

export default async function DetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Detail />
    </Suspense>
  );
}
