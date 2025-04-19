import type {
  OrderSheetByIdResponse,
  OrderSheetList,
} from '@/features/order-sheet/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const createOrderSheet = async (body: OrderSheetList) => {
  return await api.post<{ orderSheetId: string }, OrderSheetList>(
    ENDPOINTS.orderSheets,
    body,
  );
};

export const fetchOrderSheetById = async (orderSheetId: string) => {
  return await api.get<OrderSheetByIdResponse>(
    `${ENDPOINTS.orderSheets}/${orderSheetId}`,
  );
};
