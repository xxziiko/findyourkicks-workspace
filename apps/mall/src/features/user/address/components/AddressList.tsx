import { useAddressList } from '@/features/user/address';
import { Modal } from '@/shared/components/layouts';
import styles from './AddressList.module.scss';

export default function AddressList({ onClose }: { onClose: () => void }) {
  const { addresses, onUpdateDefaultAddress } = useAddressList(onClose);

  return (
    <div className={styles.address}>
      <div className={styles.address__list}>
        {addresses.map(
          ({
            addressId,
            receiverName,
            isDefault,
            alias,
            address,
            receiverPhone,
          }) => (
            <button
              type="button"
              key={addressId}
              className={styles.address__item}
              onClick={() => onUpdateDefaultAddress(addressId)}
            >
              <div className={styles.address__header}>
                <p className={styles.address__header__name}>{receiverName}</p>
                {isDefault && (
                  <p className={styles.address__header__label}>기본 배송지</p>
                )}
              </div>

              <div className={styles.address__body}>
                <p>{alias}</p>
                <p>{address}</p>
                <p>{receiverPhone}</p>
              </div>
            </button>
          ),
        )}
      </div>

      <Modal.Footer type="single" onClose={onClose} />
    </div>
  );
}
