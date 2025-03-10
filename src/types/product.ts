import type { fetchProducts } from '@/app/lib/api';

export type ProductResponse = Awaited<ReturnType<typeof fetchProducts>>;
export type ProductItem = ProductResponse['items'][0];

export type SizeHandler = (size: number) => void;

export type OptionProps = BaseOption & OptionHandlers;
export type DetailViewProps = DetailViewBase & OptionHandlers;

export type OptionHandlers = {
  [K in
    | 'onIncrementButtonClick'
    | 'onDecrementButtonClick'
    | 'onDeleteButtonClick']: SizeHandler;
};

export interface SelectedOption {
  size: number;
  quantity: number;
}

export interface CartItem extends SelectedOption {
  productId: string;
  imageUrl: string;
  title: string;
  price: number;
}

export interface BaseOption extends SelectedOption {
  price: number;
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

interface DetailViewBase {
  item: ProductItem;
  price: number;
  inventory: InventoryItem[];
  totalQuantity: number;
  selectedOptions: SelectedOption[];
  handleSelectSize: SizeHandler;
  handleCartButton: () => void;
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
