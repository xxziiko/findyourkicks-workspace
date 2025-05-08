import type { UserAddress } from '@/features/user/address/types';

export interface OrderSheetByIdResponse {
  orderSheetId: string;
  orderSheetItems: OrderProductItem[];
  deliveryAddress: UserAddress;
}

export type OrderSheetList = OrderSheetItem[];

export interface OrderProductItem extends OrderSheetItem {
  title: string;
  image: string;
}

interface OrderSheetItem {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  price: number;
}
