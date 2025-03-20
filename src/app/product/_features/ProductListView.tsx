import { ProductCardBtn } from '@/components';
import type { ProductItem } from '@/lib/types';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import type { Ref } from 'react';
import styles from './ProductListView.module.scss';

export type ProductListProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: Ref<HTMLDivElement | null>;
  handleCardButton: (item: ProductItem) => () => void;
  products: ProductItem[];
};

export default function ProductListView({
  handleCardButton,
  isFetchingNextPage,
  loadMoreRef,
  products,
}: ProductListProps) {
  return (
    <div>
      <section className={styles.list}>
        {products?.map((product: ProductItem) => (
          <Link href={`/product/${product.productId}`} key={product.productId}>
            <ProductCardBtn
              src={product.image}
              brand={product.brand}
              title={product.title}
              price={product.price}
              onClick={handleCardButton(product)}
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
