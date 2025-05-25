import {
  ProductList,
  ProductListLoading,
  productQueries,
} from '@/features/product';
import { fetchProductsByBrand } from '@/features/product/apis';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <Suspense fallback={<ProductListLoading />}>
      <Products />
    </Suspense>
  );
}

async function Products() {
  const productsByVans = await fetchProductsByBrand('vans');
  const productsByNike = await fetchProductsByBrand('nike');

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    ...productQueries.list(),
    initialPageParam: 1,
  });

  const products = {
    productsByVans,
    productsByNike,
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList products={products} />
    </HydrationBoundary>
  );
}
