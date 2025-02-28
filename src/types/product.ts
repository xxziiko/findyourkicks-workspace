import type { fetchProducts } from '@/app/lib/api';

export type ProductResponse = Awaited<ReturnType<typeof fetchProducts>>;
export type ProductItem = ProductResponse['items'][0];

export interface ApiResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: Item[];
}

interface Item {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}
