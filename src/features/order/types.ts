import type { OrderProductItem } from '@/features/order-sheet/types';

export interface OrderRequest {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  payment: {
    paymentMethod: string;
    paymentEasypayProvider: string;
    amount: number;
    orderName: string;
  };
  address: {
    alias: string;
    receiverName: string;
    receiverPhone: string;
    address: string;
    message: string;
  };
}

export interface OrderResponse {
  message: string;
  orderId: string;
}

export interface OrderListItem {
  orderId: string;
  orderDate: string;
  product: OrderProductItem & {
    id: string;
  };
}

export type OrderList = Record<string, OrderListItem[]>;

export interface OrderListResponse {
  orders: OrderList;
  hasMore: boolean;
}
