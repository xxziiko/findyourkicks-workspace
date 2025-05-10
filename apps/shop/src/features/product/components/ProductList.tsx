'use client';
import {
  BannerSlide,
  ProductListLoading,
  ProductSection,
  useProductList,
} from '@/features/product';
import type { ProductItem } from '@/features/product/types';
import { Loader } from 'lucide-react';
import { ImpressionArea } from 'react-simplikit';
import styles from './ProductList.module.scss';

const SECTION_TITLE = {
  VANS: '언제 어디서나 함께, 반스 시리즈',
  NIKE: 'Just Do It, Nike 시리즈',
  ALL: '모든 신발 둘러보기',
} as const;

interface ProductListProps {
  products: {
    initialProducts: ProductItem[];
    productsByVans: ProductItem[];
    productsByNike: ProductItem[];
  };
}

export default function ProductList({ products }: ProductListProps) {
  const { initialProducts, productsByVans, productsByNike } = products;
  const { allLoaded, onAllImageLoad, onFetchNextPage, productList } =
    useProductList({
      initialValues: initialProducts,
    });

  const sections = [
    {
      title: SECTION_TITLE.VANS,
      products: productsByVans,
    },
    {
      title: SECTION_TITLE.NIKE,
      products: productsByNike,
    },
    {
      title: SECTION_TITLE.ALL,
      products: productList,
    },
  ] as const;

  return (
    <>
      {!allLoaded && <ProductListLoading />}

      <section className={styles.banner}>
        <BannerSlide />
      </section>

      {sections.map(({ title, products }) => (
        <ProductSection
          key={title}
          title={title}
          products={products}
          onAllImageLoad={onAllImageLoad}
        />
      ))}

      {/* TODO: 직접 구현 */}
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
