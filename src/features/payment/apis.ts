import { api } from '@/shared/utils/api';

interface Payments {
  orderSheetId: string;
  userAddressId: string;
  deliveryAddress?: {
    alias?: string;
    receiverName?: string;
    receiverPhone?: string;
    address?: string;
    message?: string;
  };
  termsAgreed: boolean;
}

interface PaymentsResponse {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}

export const requestPayments = async (body: Payments) => {
  return await api.post<PaymentsResponse, Payments>('/payments', body);
};
