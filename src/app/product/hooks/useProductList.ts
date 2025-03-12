import { productItemAtom } from '@/app/lib/store';
import { useFetchProductsQuery } from '@/app/product/hooks';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import type { ProductItem, ProductResponse } from '@/types/product';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

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
  const setProductItemAtom = useSetAtom(productItemAtom);

  const handleCardButton = useCallback(
    (item: ProductItem) => () => setProductItemAtom(item),
    [setProductItemAtom],
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
