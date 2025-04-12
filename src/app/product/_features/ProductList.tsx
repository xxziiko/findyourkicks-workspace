'use client';

import ProductListView from './ProductListView';
import useProductList, { type ProductResponse } from './useProductList';

export default function ProductList({
  products,
}: { products: ProductResponse }) {
  const props = useProductList({ initialValues: products });

  return <ProductListView {...props} />;
}
