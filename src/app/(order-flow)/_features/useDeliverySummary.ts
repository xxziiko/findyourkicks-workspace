import type { UserAddress } from '@/features/user/address/types';
import { deliveryMessageAtom } from '@/lib/store';
import { useAtom } from 'jotai';

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
];

export default function useDeliverySummary(data: UserAddress | null) {
  const address = mapAddressData(data);
  const [deliveryMessage, setDeliveryMessage] = useAtom(deliveryMessageAtom);

  function mapAddressData(data: UserAddress | null) {
    if (!data) return [];

    return KEYS.map((key, index) => ({
      subtitle: DELIVERY_SUBTITLE[index],
      data: data[key],
    }));
  }

  return {
    address,
    deliveryMessage,
    setDeliveryMessage,
  };
}
