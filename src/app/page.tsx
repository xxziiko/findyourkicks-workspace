import { fetchNaverData } from '@/lib/api';
import ProductList from './product/_features/ProductList';

const fetchForSSG = async () => await fetchNaverData();

export default async function Home() {
  const initialProducts = await fetchForSSG();

  return <ProductList initialProducts={initialProducts} />;
}
