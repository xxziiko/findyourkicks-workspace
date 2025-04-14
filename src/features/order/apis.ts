import { api } from '@/shared/utils/api';
import type { Order, OrderRequest } from './types';

interface OrderResponse {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}

interface CreateOrderResponse {
  message: string;
  orderId: string;
}

export const createOrder = async (body: OrderRequest) => {
  const { data } = await api.post<CreateOrderResponse, OrderRequest>(
    '/order',
    body,
  );
  return data;
};

export const getOrderById = async (orderId: string) => {
  const { data } = await api.get<Order>(`/order/${orderId}`);
  return data;
};
