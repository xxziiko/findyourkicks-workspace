'use client';

import type { Products } from '@/features/product/types';
import { useImagesLoaded } from '@/shared/hooks';
import { useRef } from 'react';
import useFetchProductsQuery from './useFetchProductsQuery';

export default function useProductList({
  initialValues,
}: { initialValues: Products }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: productList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchProductsQuery({ initialValues });

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
