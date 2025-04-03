import type { Detail } from '@/app/product/[id]/_features/Detail';

export type EventHandlers = {
  onQuantityChange: QuantityHandlerType;
  onSelectSize: (id: string) => void;
};

export type QuantityHandlerType = (id: string, quantity: number) => void;

export interface SelectedOption {
  size: string;
  quantity: number;
}

type ProductItemWithSelectedOpion = Detail & SelectedOption;

export interface CartItem extends ProductItemWithSelectedOpion {
  cartId: string;
}

export interface CartListItemProps extends EventHandlers {
  item: CartItem;
}

export interface InventoryItem {
  size: string;
  stock: number;
}
