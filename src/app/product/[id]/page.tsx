import Loading from '@/app/loading';
import Detail from '@/app/ui/Detail';
import { Suspense } from 'react';

export default async function DetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Detail />
    </Suspense>
  );
}
