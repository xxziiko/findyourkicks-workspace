import { ProductList, ProductListLoading } from '@/features/product';
import { fetchProducts } from '@/features/product/apis';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <Suspense fallback={<ProductListLoading />}>
      <Products />
    </Suspense>
  );
}

async function Products() {
  const products = await fetchProducts();

  return <ProductList products={products} />;
}
