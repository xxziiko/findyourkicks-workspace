import type {
  OrderSheetByIdResponse,
  OrderSheetRequest,
} from '@/features/order-sheet/types';
import { api } from '@/shared/utils/api';

export const createOrderSheet = async ({ userId, body }: OrderSheetRequest) => {
  const { data } = await api.post<{ orderSheetId: string }, OrderSheetRequest>(
    '/order-sheet',
    { userId, body },
  );
  return data;
};

export const fetchOrderSheetById = async (orderSheetId: string) => {
  const { data } = await api.get<OrderSheetByIdResponse>(
    `/order-sheet/${orderSheetId}`,
  );
  return data;
};
