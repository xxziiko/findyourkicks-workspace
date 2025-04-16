import { ProductList, ProductListLoading } from '@/features/product';
import { fetchProducts } from '@/features/product/apis';
import { Suspense } from 'react';

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
