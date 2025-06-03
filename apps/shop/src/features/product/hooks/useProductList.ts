'use client';

import { useProductsQuery } from '@/features/product';
import { useImagesLoaded } from '@/shared/hooks';
import { useRef } from 'react';

export default function useProductList() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: productList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductsQuery();

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
    handleImageLoad,
    handleFetchNextPage,
  };
}
