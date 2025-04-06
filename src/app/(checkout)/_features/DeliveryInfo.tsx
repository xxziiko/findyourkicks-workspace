'use client';

import type { Address } from '@/app/api/checkout/[id]/route';
import { Dropdown, NoData } from '@/components';
import { CircleAlertIcon } from 'lucide-react';
import styles from './DeliveryInfo.module.scss';
import useDeliveryInfo from './uesDeliveryInfo';

const DELIVERY_TEXT = [
  '요청사항 없음',
  '경비실에 보관해주세요.',
  '문 앞에 놓아주세요.',
  '직접 입력',
] as const;

export default function DeliveryInfo({ data }: { data: Address | null }) {
  const { address, deliveryMessage, setDeliveryMessage } =
    useDeliveryInfo(data);

  return (
    <>
      {!data && (
        <NoData title="배송지를 입력해주세요!" icon={<CircleAlertIcon />} />
      )}

      {data && (
        <>
          {address.map((info) => (
            <div className={styles.delivery__item} key={info.subtitle}>
              <p className={styles.delivery__sub}>{info.subtitle}</p>
              <p>{info.data}</p>
            </div>
          ))}

          <div className={styles.delivery__item}>
            <p className={styles['delivery__sub--last']}>베송 메세지</p>

            <Dropdown
              variant="border"
              selectedText={deliveryMessage}
              setSelectedText={setDeliveryMessage}
            >
              {DELIVERY_TEXT.map((item) => (
                <Dropdown.Item key={item} text={item} />
              ))}
            </Dropdown>
          </div>
        </>
      )}
    </>
  );
}
