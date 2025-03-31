'use client';

import ProductListView from './ProductListView';
import useProductList, { type ProductResponse } from './useProductList';

export default function ProductList({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const props = useProductList({ initialProducts });

  return <ProductListView {...props} />;
}
