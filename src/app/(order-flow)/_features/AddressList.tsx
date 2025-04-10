import type { Address } from '@/app/api/checkout/[id]/route';
import Modal from '@/components/layouts/Modal';
import { fetchUserAddresses, updateUserAddress } from '@/lib/api';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import styles from './AddressList.module.scss';

export default function AddressList({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: addresses } = useSuspenseQuery({
    queryKey: ['addresses'],
    queryFn: fetchUserAddresses,
  });

  const { mutate: mutateDefaultAddress } = useMutation({
    mutationFn: updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses', 'defaultAddress'],
      });
      onClose();
    },
  });

  const onUpdateDefaultAddress = (addressId: string) => {
    mutateDefaultAddress(addressId);
  };

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
