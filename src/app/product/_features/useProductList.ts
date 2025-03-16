import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { productItemAtom } from '@/lib/store';
import type { ProductItem, ProductResponse } from '@/lib/types';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import useFetchProductsQuery from './useFetchProductsQuery';

export default function useProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: products,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchProductsQuery({ initialProducts });
  const setProductItem = useSetAtom(productItemAtom);

  const handleCardButton = useCallback(
    (item: ProductItem) => () => setProductItem(item),
    [setProductItem],
  );

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
    handleCardButton,
    isFetchingNextPage,
    loadMoreRef,
  };
}
