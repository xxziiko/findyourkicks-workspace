import { ProductList, ProductListLoading } from '@/features/product';
import { fetchProducts } from '@/features/product/apis';
import { fetchProductsByBrand } from '@/features/product/apis';
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
  try {
    const initialProducts = await fetchProducts();
    const productsByVans = await fetchProductsByBrand('vans');
    const productsByNike = await fetchProductsByBrand('nike');

    const products = {
      initialProducts,
      productsByVans,
      productsByNike,
    };

    return <ProductList products={products} />;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}
