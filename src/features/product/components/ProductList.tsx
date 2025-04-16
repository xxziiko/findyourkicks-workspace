'use client';

import { ProductListView, useProductList } from '@/features/product';
import type { Products } from '@/features/product/types';

export default function ProductList({ products }: { products: Products }) {
  const props = useProductList({ initialValues: products });

  return <ProductListView {...props} />;
}
