import { Loader } from 'lucide-react';
import Link from 'next/link';
import type { Ref } from 'react';
import ProductCardBtn from './ProductCardBtn';
import styles from './ProductListView.module.scss';

export interface ProductItem {
  productId: string;
  image: string;
  title: string;
  price: number;
  brand: string;
  category: string;
}

export type ProductListProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: Ref<HTMLDivElement | null>;
  products: ProductItem[];
};

export default function ProductListView({
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
