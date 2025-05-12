import { ProductCardBtn } from '@/features/product';
import type { ProductItem } from '@/features/product/types';
import Link from 'next/link';
import styles from './ProductSection.module.scss';

export function ProductSection({
  title,
  products,
  onAllImageLoad,
}: { title: string; products: ProductItem[]; onAllImageLoad: () => void }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.list}>
        {products.map(({ productId, image, brand, title, price }) => (
          <Link
            href={`/product/${productId}`}
            key={productId}
            className={styles.item}
          >
            <ProductCardBtn
              src={image}
              brand={brand}
              title={title}
              price={price}
              onAllImageLoad={onAllImageLoad}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
