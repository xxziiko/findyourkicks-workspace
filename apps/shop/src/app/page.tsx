import {
  BannerLoading,
  BannerSlide,
  ProductListLoading,
  ProductSectionList,
  SECTION_TITLE,
  productQueries,
} from '@/features/product';
import { fetchProductsByBrand } from '@/features/product/actions';
import { getServerQueryClient } from '@/shared/utils/query/getServerQueryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

// export const revalidate = 60 * 60 * 24 * 30;

export default async function Home() {
  return <Products />;
}

async function Products() {
  const [vansProducts, nikeProducts] = await Promise.all([
    fetchProductsByBrand('vans'),
    fetchProductsByBrand('nike'),
  ]);

  const queryClient = getServerQueryClient();
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
    <div>
      <Suspense fallback={<BannerLoading />}>
        <BannerSlide />
      </Suspense>

      <Suspense fallback={<ProductListLoading />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductSectionList sections={sections} />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}
