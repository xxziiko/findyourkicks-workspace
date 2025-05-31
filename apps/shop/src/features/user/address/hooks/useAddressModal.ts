import type { UserAddress } from '@/features/user/address';
import { useModalControl } from '@findyourkicks/shared';
import { useCallback, useState } from 'react';

export function useAddressModal(defaultAddress: UserAddress) {
  const { isOpen, toggleModal } = useModalControl(false);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    !defaultAddress ? 'form' : 'list',
  );
  const addressModalTitle = modalView === 'form' ? '주소 입력' : '주소 변경';

  const switchToFormView = useCallback(() => setModalView('form'), []);

  const closeModal = useCallback(() => {
    toggleModal();
    setModalView(defaultAddress.addressId ? 'list' : 'form');
  }, [defaultAddress.addressId, toggleModal]);

  return {
    isModalOpen: isOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,
  };
}
