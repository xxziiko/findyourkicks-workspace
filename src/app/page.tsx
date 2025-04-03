import { fetchProducts } from '@/lib/api';
import ProductList from './product/_features/ProductList';

// export const dynamic = 'force-static';

export default async function Home() {
  const initialProducts = await fetchProducts();

  return <ProductList initialProducts={initialProducts} />;
}
