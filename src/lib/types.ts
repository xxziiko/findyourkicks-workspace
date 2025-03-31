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
  price: number;
  brand: string;
  category: string;
}

type ProductItemWithSelectedOpion = ProductItem & SelectedOption;
export interface CartItem extends ProductItemWithSelectedOpion {
  cartId: string;
}

export interface CartListItemProps extends EventHandlers {
  item: CartItem;
}

export interface ApiResponse {
  pageParams: number[];
  pages: ProductItem[][];
}

export interface InventoryItem {
  size: string;
  stock: number;
}

export type RawProduct = {
  product_id: string;
  title: string;
  price: number;
  image: string;

  brand: {
    name: string;
  } | null;

  category: {
    name: string;
  } | null;
};
