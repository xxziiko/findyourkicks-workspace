import type {
  OrderSheetByIdResponse,
  OrderSheetList,
} from '@/features/order-sheet/types';
import { api } from '@/shared/utils/api';

export const createOrderSheet = async (body: OrderSheetList) => {
  return await api.post<{ orderSheetId: string }, OrderSheetList>(
    '/order-sheet',
    body,
  );
};

export const fetchOrderSheetById = async (orderSheetId: string) => {
  return await api.get<OrderSheetByIdResponse>(`/order-sheet/${orderSheetId}`);
};
