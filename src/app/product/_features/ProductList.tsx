'use client';

import type { ProductItem, ProductResponse } from '@/lib/types';
import type { Ref } from 'react';
import ProductListView from './ProductListView';
import useProductList from './useProductList';

export type ProductListProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: Ref<HTMLDivElement | null>;
  handleCardButton: (item: ProductItem) => () => void;
  products: ProductItem[];
};

export default function ProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const props = useProductList({ initialProducts });

  return <ProductListView {...props} />;
}
