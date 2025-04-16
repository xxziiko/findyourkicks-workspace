'use client';

import { useDeliverySummary } from '@/features/user/address';
import type { UserAddress } from '@/features/user/address/types';
import { Dropdown, NoData } from '@/shared/components';
import { CircleAlertIcon } from 'lucide-react';
import styles from './DeliverySummary.module.scss';

const DELIVERY_TEXT = [
  '요청사항 없음',
  '경비실에 보관해주세요.',
  '문 앞에 놓아주세요.',
  '직접 입력',
] as const;

export default function DeliverySummary({
  data,
}: { data: UserAddress | null }) {
  const { address, deliveryMessage, setDeliveryMessage } =
    useDeliverySummary(data);

  return (
    <>
      {!data?.address && (
        <NoData title="배송지를 입력해주세요!" icon={<CircleAlertIcon />} />
      )}

      {data?.address && (
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
              selected={deliveryMessage}
              setSelected={setDeliveryMessage}
            >
              <Dropdown.Trigger />
              <Dropdown.Menu>
                {DELIVERY_TEXT.map((item) => (
                  <Dropdown.Item
                    key={item}
                    text={item}
                    editable={item === '직접 입력'}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      )}
    </>
  );
}
