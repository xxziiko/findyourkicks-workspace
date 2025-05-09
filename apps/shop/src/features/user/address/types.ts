export interface UserAddress {
  addressId: string;
  alias: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  message: string;
  isDefault?: boolean;
}

export interface UserAddressRequest {
  name: string;
  phone: string;
  alias: string;
  address: string;
}
