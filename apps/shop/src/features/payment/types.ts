export interface Payments {
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

export interface PaymentsResponse {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}
