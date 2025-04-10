import type { Address } from '@/app/api/checkout/[id]/route';
import Modal from '@/components/layouts/Modal';
import styles from './AddressList.module.scss';
import useAddressList from './useAddressList';

export default function AddressList({ onClose }: { onClose: () => void }) {
  const { addresses, onUpdateDefaultAddress } = useAddressList(onClose);

  return (
    <div className={styles.address}>
      <div className={styles.address__list}>
        {addresses.map((address: Address) => (
          <button
            type="button"
            key={address.addressId}
            className={styles.address__item}
            onClick={() => onUpdateDefaultAddress(address.addressId)}
          >
            <div className={styles.address__header}>
              <p className={styles.address__header__name}>
                {address.receiverName}
              </p>
              {address.isDefault && (
                <p className={styles.address__header__label}>기본 배송지</p>
              )}
            </div>

            <div className={styles.address__body}>
              <p>{address.alias}</p>
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
