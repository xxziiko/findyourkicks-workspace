'use client';

import type { Products } from '@/features/product/types';
import { useImagesLoaded, useIntersectionObserver } from '@/shared/hooks';
import { useEffect, useRef } from 'react';
import useFetchProductsQuery from './useFetchProductsQuery';

export default function useProductList({
  initialValues,
}: { initialValues: Products }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: products,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchProductsQuery({ initialValues });

  const { allLoaded, handleImageLoad } = useImagesLoaded(products.length);

  const observe = useIntersectionObserver(
    () => {
      if (!isFetchingNextPage && hasNextPage) fetchNextPage();
    },
    { threshold: 1 },
  );

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observe(currentRef);
      return () => observe(currentRef);
    }
  }, [observe]);

  return {
    products,
    isFetchingNextPage,
    loadMoreRef,
    onAllImageLoad: handleImageLoad,
    allLoaded,
  };
}
