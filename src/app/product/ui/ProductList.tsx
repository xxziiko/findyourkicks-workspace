'use client';

import { productItemAtom } from '@/app/lib/store';
import { useFetchProductsQuery } from '@/app/product/hooks';
import { Card } from '@/components';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import type { ProductItem, ProductResponse } from '@/types/product';
import { useSetAtom } from 'jotai';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import styles from './ProductList.module.scss';

export default function ProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchProductsQuery({ initialProducts });
  const setProductItemAtom = useSetAtom(productItemAtom);

  const selectProduct = useCallback(
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

  return (
    <div>
      <section className={styles.list}>
        {data?.map((item: ProductItem) => (
          <Link href={`/product/${item.productId}`} key={item.productId}>
            <Card
              src={item.image}
              brand={item.brand}
              title={item.title}
              price={item.lprice}
              onClick={selectProduct(item)}
            />
          </Link>
        ))}
      </section>

      {isFetchingNextPage && (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}

      <div ref={loadMoreRef} />
    </div>
  );
}
