import type { Products } from '@/features/product/types';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import type { Ref } from 'react';
import ProductCardBtn from './ProductCardBtn';
import styles from './ProductListView.module.scss';

export type ProductListProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: Ref<HTMLDivElement | null>;
  products: Products;
};

export default function ProductListView({
  isFetchingNextPage,
  loadMoreRef,
  products,
}: ProductListProps) {
  return (
    <div>
      <section className={styles.list}>
        {products.map(({ productId, image, brand, title, price }) => (
          <Link href={`/product/${productId}`} key={productId}>
            <ProductCardBtn
              src={image}
              brand={brand}
              title={title}
              price={price}
            />
          </Link>
        ))}
      </section>

      {isFetchingNextPage && (
        <div className={styles.loading}>
          <Loader className={styles.loading__loader} />
        </div>
      )}

      <div ref={loadMoreRef} />
    </div>
  );
}
