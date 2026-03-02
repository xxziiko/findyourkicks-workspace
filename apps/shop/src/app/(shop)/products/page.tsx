import { ProductSearchPage } from '@/features/product/components/ProductSearchPage';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductSearchPage />
    </Suspense>
  );
}
