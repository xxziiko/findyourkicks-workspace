import type { fetchProducts } from '@/lib/api';

export type ProductResponse = Awaited<ReturnType<typeof fetchProducts>>;

export type EventHandlers = {
  onQuantityChange: QuantityHandlerType;
  onSelectSize: (id: string) => void;
};

export type QuantityHandlerType = (id: string, quantity: number) => void;

export interface SelectedOption {
  size: string;
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

export interface CartListItemProps extends EventHandlers {
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
  size: string;
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
