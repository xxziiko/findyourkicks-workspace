import { fetchNaverData } from '@/app/lib/api';
import { Suspense } from 'react';
import Loading from './loading';
import ProductList from './ui/ProductList';

const fetchForSSG = async (page = 1) => await fetchNaverData(page);

export default async function Home() {
  const initialProducts = await fetchForSSG();

  return (
    <Suspense fallback={<Loading />}>
      <ProductList initialProducts={initialProducts} />
    </Suspense>
  );
}
