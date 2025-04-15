import { fetchProducts } from '@/features/product/apis';
import { Suspense } from 'react';
import ProductListLoading from './ProductListLoading';
import ProductList from './product/_features/ProductList';

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
