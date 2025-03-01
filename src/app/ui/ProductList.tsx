'use client';

import { Card } from '@/components';
import { useFetchProducts } from '@/hooks';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import type { ProductItem, ProductResponse } from '@/types/product';
import { useSetAtom } from 'jotai';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { productItem } from '../lib/store';

export default function ProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchProducts({ initialProducts });
  const setProductItem = useSetAtom(productItem);

  const selectProduct = useCallback(
    (item: ProductItem) => setProductItem(item),
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

  return (
    <div className="w-full h-full">
      <section className="flex flex-wrap justify-center gap-4 ">
        {data?.map((item: ProductItem) => (
          <Link href={`/product/${item.productId}`} key={item.productId}>
            <Card
              src={item.image}
              brand={item.brand}
              title={item.title}
              price={item.lprice}
              onClick={() => selectProduct(item)}
            />
          </Link>
        ))}
      </section>

      {isFetchingNextPage && (
        <div className="flex justify-center pt-8">
          <Loader />
        </div>
      )}

      <div ref={loadMoreRef} />
    </div>
  );
}
