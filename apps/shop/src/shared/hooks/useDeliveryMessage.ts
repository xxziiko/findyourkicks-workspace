import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const deliveryMessageAtom = atom('메세지를 선택해주세요');

export function useDeliveryMessage() {
  const [deliveryMessage, setDeliveryMessage] = useAtom(deliveryMessageAtom);

  const updateDeliveryMessage = useCallback(
    (message: string) => {
      setDeliveryMessage(message);
    },
    [setDeliveryMessage],
  );

  return { deliveryMessage, updateDeliveryMessage };
}
