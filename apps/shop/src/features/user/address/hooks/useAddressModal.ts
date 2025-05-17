import type { UserAddress } from '@/features/user/address/types';
import { useCallback, useState } from 'react';

export function useAddressModal(defaultAddress: UserAddress) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    !defaultAddress ? 'form' : 'list',
  );
  const addressModalTitle = modalView === 'form' ? '주소 입력' : '주소 변경';

  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);
  const switchToFormView = useCallback(() => setModalView('form'), []);

  const closeModal = useCallback(() => {
    toggleModal();
    setModalView(defaultAddress.addressId ? 'list' : 'form');
  }, [defaultAddress.addressId, toggleModal]);

  return {
    isModalOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,
  };
}
