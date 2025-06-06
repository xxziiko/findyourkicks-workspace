'use client';

import { useProductsQuery } from '@/features/product';
import type { ProductItem, SECTION_TITLE } from '@/features/product';
import { useImagesLoaded } from '@/shared/hooks';
import { useRef } from 'react';

export default function useProductList({
  sections,
}: {
  sections: {
    title: (typeof SECTION_TITLE)[keyof typeof SECTION_TITLE];
    products: ProductItem[];
  }[];
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: productList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductsQuery();

  const totalProductCount = sections.reduce(
    (acc, { products }) => acc + products.length,
    0,
  );

  const { allLoaded, handleImageLoadCount } =
    useImagesLoaded(totalProductCount);

  const handleFetchNextPage = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  return {
    productList,
    allLoaded,
    isFetchingNextPage,
    loadMoreRef,
    handleImageLoadCount,
    handleFetchNextPage,
  };
}
