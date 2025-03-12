'use client';

import type { ProductItem, ProductResponse } from '@/types/product';
import type { Ref } from 'react';
import useProductList from '../hooks/useProductList';
import ProductListView from './ProductListView';

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
