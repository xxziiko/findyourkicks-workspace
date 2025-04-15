import { api } from '@/shared/utils/api';
import type { Order, OrderRequest } from './types';

interface CreateOrderResponse {
  message: string;
  orderId: string;
}

export const createOrder = async (body: OrderRequest) => {
  return await api.post<CreateOrderResponse, OrderRequest>('/orders', body);
};

export const getOrderById = async (orderId: string) => {
  return await api.get<Order>(`/orders/${orderId}`);
};
