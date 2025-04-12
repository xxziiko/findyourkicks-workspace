import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import type { fetchProducts } from '@/lib/api';
import { useEffect, useRef } from 'react';
import useFetchProductsQuery from './useFetchProductsQuery';

// FIXME: 타입 정의 추후 수정 필요
export type ProductResponse = Awaited<ReturnType<typeof fetchProducts>>;

export default function useProductList({
  initialValues,
}: { initialValues: ProductResponse }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: products,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchProductsQuery({ initialValues });

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
  };
}
