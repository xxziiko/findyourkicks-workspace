'use client';

import { useProductsQuery } from '@/features/product';
import type { Products } from '@/features/product/types';
import { useImagesLoaded } from '@/shared/hooks';
import { useRef } from 'react';

export default function useProductList({
  initialValues,
}: { initialValues: Products }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: productList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductsQuery({ initialValues });

  const { allLoaded, handleImageLoad } = useImagesLoaded(productList.length);

  const handleFetchNextPage = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  return {
    productList,
    allLoaded,
    isFetchingNextPage,
    loadMoreRef,
    onAllImageLoad: handleImageLoad,
    onFetchNextPage: handleFetchNextPage,
  };
}
