import type { Payments, PaymentsResponse } from '@/features/payment/types';
import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const requestPayments = async (body: Payments) => {
  return await api.post<PaymentsResponse, Payments>(ENDPOINTS.payments, body);
};
