'use client';
import {
  ProductListLoading,
  ProductSection,
  SECTION_TITLE,
  useProductList,
} from '@/features/product';
import type { ProductItem } from '@/features/product/types';
import { Loader } from 'lucide-react';
import { ImpressionArea } from 'react-simplikit';
import styles from './ProductSectionList.module.scss';

interface ProductSectionListProps {
  sections: {
    title: (typeof SECTION_TITLE)[keyof typeof SECTION_TITLE];
    products: ProductItem[];
  }[];
}

export function ProductSectionList({ sections }: ProductSectionListProps) {
  const { allLoaded, handleImageLoad, handleFetchNextPage, productList } =
    useProductList();

  return (
    <>
      {!allLoaded && <ProductListLoading />}

      {sections.map(({ title, products }) => (
        <ProductSection
          key={title}
          title={title}
          products={products}
          onAllImageLoad={handleImageLoad}
        />
      ))}

      <ProductSection
        title={SECTION_TITLE.ALL}
        products={productList}
        onAllImageLoad={handleImageLoad}
      />

      {/* TODO: 직접 구현 */}
      <ImpressionArea
        onImpressionStart={handleFetchNextPage}
        areaThreshold={0.2}
        className={styles.loading}
      >
        <Loader className={styles.loading__loader} />
      </ImpressionArea>
    </>
  );
}
