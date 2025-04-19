import { atom, useAtom } from 'jotai';

const deliveryMessageAtom = atom('메세지를 선택해주세요');

export default function useDeliveryMessage() {
  const [deliveryMessage, setDeliveryMessage] = useAtom(deliveryMessageAtom);

  return { deliveryMessage, setDeliveryMessage };
}
