import type {
  OrderSheetByIdResponse,
  OrderSheetRequest,
} from '@/features/order-sheet/types';
import { api } from '@/shared/utils/api';

export const createOrderSheet = async ({ userId, body }: OrderSheetRequest) => {
  return await api.post<{ orderSheetId: string }, OrderSheetRequest>(
    '/order-sheet',
    { userId, body },
  );
};

export const fetchOrderSheetById = async (orderSheetId: string) => {
  return await api.get<OrderSheetByIdResponse>(`/order-sheet/${orderSheetId}`);
};
