import {
  ProductListLoading,
  ProductSectionList,
  SECTION_TITLE,
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

const BRANDS = ['vans', 'nike'] as const;

async function Products() {
  const [vansProducts, nikeProducts] = await Promise.all(
    BRANDS.map(async (brand) => await fetchProductsByBrand(brand)),
  );

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    ...productQueries.list(),
    initialPageParam: 1,
  });

  const sections = [
    {
      title: SECTION_TITLE.VANS,
      products: vansProducts,
    },
    {
      title: SECTION_TITLE.NIKE,
      products: nikeProducts,
    },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductSectionList sections={sections} />
    </HydrationBoundary>
  );
}
