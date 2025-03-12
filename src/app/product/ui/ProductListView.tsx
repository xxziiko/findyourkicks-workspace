import { Card } from '@/components';
import type { ProductItem } from '@/types/product';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import type { ProductListProps } from '../ProductList';
import styles from './ProductListView.module.scss';

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
            <Card
              src={product.image}
              brand={product.brand}
              title={product.title}
              price={product.lprice}
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
