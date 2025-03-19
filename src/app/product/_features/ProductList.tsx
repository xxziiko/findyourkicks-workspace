'use client';

import type { ProductResponse } from '@/lib/types';
import ProductListView from './ProductListView';
import useProductList from './useProductList';

export default function ProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const props = useProductList({ initialProducts });

  return <ProductListView {...props} />;
}
