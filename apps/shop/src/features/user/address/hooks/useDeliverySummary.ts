import type { UserAddress } from '@/features/user/address/types';
import { useDeliveryMessage } from '@/shared/hooks';

const DELIVERY_SUBTITLE = [
  '배송지 명',
  '주문자 명',
  '연락처',
  '배송지',
] as const;

const KEYS: (keyof UserAddress)[] = [
  'alias',
  'receiverName',
  'receiverPhone',
  'address',
] as const;

function mapAddressData(data: UserAddress | null) {
  if (!data) return [];

  return KEYS.map((key, index) => ({
    subtitle: DELIVERY_SUBTITLE[index],
    data: data[key],
  }));
}

export default function useDeliverySummary(data: UserAddress | null) {
  const address = mapAddressData(data);
  const { deliveryMessage, updateDeliveryMessage } = useDeliveryMessage();

  return {
    address,
    deliveryMessage,
    updateDeliveryMessage,
  };
}
