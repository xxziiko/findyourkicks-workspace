import {
  addressQueries,
  useUpdateAddressMutation,
  useUserAddressesQuery,
} from '@/features/user/address';
import { Modal } from '@findyourkicks/shared';
import { useQueryClient } from '@tanstack/react-query';
import styles from './AddressList.module.scss';

export default function AddressList({ onClose }: { onClose: () => void }) {
  const { data: addresses } = useUserAddressesQuery();
  const { mutate: mutateDefaultAddress } = useUpdateAddressMutation();
  const queryClient = useQueryClient();

  const handleUpdateAddress = (addressId: string) => {
    mutateDefaultAddress(addressId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: addressQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: addressQueries.default().queryKey,
        });
        onClose();
      },
    });
  };

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
              onClick={() => handleUpdateAddress(addressId)}
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

      <Modal.Footer
        buttons={[{ text: '닫기', onClick: onClose, variant: 'secondary' }]}
      />
    </div>
  );
}
