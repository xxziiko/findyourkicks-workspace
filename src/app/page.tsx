import { fetchNaverData } from '@/lib/api';
import { Suspense } from 'react';
import Loading from './loading';
import ProductList from './product/_features/ProductList';

const fetchForSSG = async () => await fetchNaverData();

export default async function Home() {
  const initialProducts = await fetchForSSG();

  return (
    <Suspense fallback={<Loading />}>
      <ProductList initialProducts={initialProducts} />
    </Suspense>
  );
}
