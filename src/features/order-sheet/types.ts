import type { UserAddress } from '@/features/user/address/types';

export interface OrderSheetRequest {
  userId: string;
  body: OrderSheetList;
}

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
  productId: string;
  cartItemId: string;
  size: string;
  quantity: number;
  price: number;
}
