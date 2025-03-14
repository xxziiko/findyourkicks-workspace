import type { fetchProducts } from '@/app/lib/api';

export type ProductResponse = Awaited<ReturnType<typeof fetchProducts>>;

export type SizeHandler = (size: number) => () => void;

export type OptionHandlers = {
  [K in 'onIncrement' | 'onDecrement' | 'onDelete']: SizeHandler;
};

export type QuantityHandler = {
  onDecrement: () => void;
  onIncrement: () => void;
};

export interface SelectedOption {
  size: number;
  quantity: number;
}

export interface ProductItem {
  productId: string;
  image: string;
  title: string;
  price: string;
  brand: string;
  category: string;
  maker: string;
}

type ProductItemWithSelectedOpion = ProductItem & SelectedOption;
export interface CartItem extends ProductItemWithSelectedOpion {
  cartId: string;
}

export interface CartListItemProps extends QuantityHandler {
  item: CartItem;
}

export interface ApiResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: Item[];
}

export interface InventoryItem {
  size: number;
  stock: number;
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
