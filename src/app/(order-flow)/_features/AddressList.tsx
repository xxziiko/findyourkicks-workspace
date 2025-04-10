import type { Address } from '@/app/api/checkout/[id]/route';
import Button from '@/components/Button';
import Modal from '@/components/layouts/Modal';
import { fetchUserAddresses } from '@/lib/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import styles from './AddressList.module.scss';

export default function AddressList({ onClose }: { onClose: () => void }) {
  const { data: addresses } = useSuspenseQuery({
    queryKey: ['addresses'],
    queryFn: fetchUserAddresses,
  });

  return (
    <div className={styles.address}>
      <div className={styles.address__list}>
        {addresses.map((address: Address) => (
          <button
            type="button"
            key={address.addressId}
            className={styles.address__item}
          >
            <div className={styles.address__header}>
              <p className={styles.address__header__name}>
                {address.receiverName}
              </p>
              {address.isDefault && (
                <Button variant="label" text={'기본 배송지'} />
              )}
            </div>

            <div className={styles.address__body}>
              <p>{address.address}</p>
              <p>{address.receiverPhone}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal.Footer type="single" onClose={onClose} />
    </div>
  );
}
