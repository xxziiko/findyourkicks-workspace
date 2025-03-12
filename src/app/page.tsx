import { fetchNaverData } from '@/app/lib/api';
import { Suspense } from 'react';
import Loading from './loading';
import ProductList from './product/ProductList';

const fetchForSSG = async () => await fetchNaverData();

export default async function Home() {
  const initialProducts = await fetchForSSG();

  return (
    <Suspense fallback={<Loading />}>
      <ProductList initialProducts={initialProducts} />
    </Suspense>
  );
}
