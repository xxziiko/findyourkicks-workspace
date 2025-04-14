import type { OrderProductItem } from '@/features/order-sheet/types';
import type { UserAddress } from '@/features/user/address/types';

export interface OrderRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
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
  deliveryAddress: UserAddress;
}

export interface OrderResponse {
  message: string;
  orderId: string;
}
