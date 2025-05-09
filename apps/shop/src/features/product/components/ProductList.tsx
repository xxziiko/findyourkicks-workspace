'use client';
import {
  ProductCardBtn,
  ProductListLoading,
  useProductList,
} from '@/features/product';
import type { Products } from '@/features/product/types';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { ImpressionArea } from 'react-simplikit';
import styles from './ProductList.module.scss';

export default function ProductList({ products }: { products: Products }) {
  const { allLoaded, onAllImageLoad, onFetchNextPage, productList } =
    useProductList({
      initialValues: products,
    });

  return (
    <>
      {!allLoaded && <ProductListLoading />}
      <section className={styles.list}>
        {productList.map(({ productId, image, brand, title, price }) => (
          <Link href={`/product/${productId}`} key={productId}>
            <ProductCardBtn
              src={image}
              brand={brand}
              title={title}
              price={price}
              onAllImageLoad={onAllImageLoad}
            />
          </Link>
        ))}
      </section>
      {/* //TODO: 직접 구현해보기 */}
      <ImpressionArea
        onImpressionStart={onFetchNextPage}
        areaThreshold={0.2}
        className={styles.loading}
      >
        <Loader className={styles.loading__loader} />
      </ImpressionArea>
    </>
  );
}
