import {
  BannerLoading,
  BannerSlide,
  ProductListLoading,
  ProductSectionList,
  SECTION_TITLE,
  productQueries,
} from '@/features/product';
import { fetchProductsByBrandServer } from '@/features/product/actions.server';
import { getServerQueryClient } from '@/shared/utils/query/getServerQueryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

// export const revalidate = 60 * 60 * 24 * 30;

export default async function Home() {
  return <Products />;
}

async function Products() {
  const [vansProducts, nikeProducts] = await Promise.all([
    fetchProductsByBrandServer('vans'),
    fetchProductsByBrandServer('nike'),
  ]);

  const queryClient = getServerQueryClient();
  await queryClient.prefetchInfiniteQuery(productQueries.list());

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
