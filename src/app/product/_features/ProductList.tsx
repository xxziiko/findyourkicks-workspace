'use client';

import type { Products } from '@/features/product/types';
import ProductListView from './ProductListView';
import useProductList from './useProductList';

export default function ProductList({ products }: { products: Products }) {
  const props = useProductList({ initialValues: products });

  return <ProductListView {...props} />;
}
