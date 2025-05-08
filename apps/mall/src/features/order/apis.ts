import type { Order, OrderRequest, OrderHistory } from '@/features/order';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

interface CreateOrderResponse {
  message: string;
  orderId: string;
}

export const createOrder = async (body: OrderRequest) => {
  return await api.post<CreateOrderResponse, OrderRequest>(
    ENDPOINTS.orders,
    body,
  );
};

export const getOrderById = async (orderId: string) => {
  return await api.get<Order>(`${ENDPOINTS.orders}/${orderId}`);
};

export const fetchOrderHistory = async (
  page = 1,
  options?: { headers?: Record<string, string> },
) => {
  return await api.get<OrderHistory>(
    `${ENDPOINTS.orders}?page=${page}`,
    options,
  );
};
