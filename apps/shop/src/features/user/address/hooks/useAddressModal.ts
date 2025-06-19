'use client';

import type { UserAddress } from '@/features/user/address';
import { useModalControl } from '@findyourkicks/shared';
import { useCallback, useState } from 'react';

export function useAddressModal(defaultAddress: UserAddress) {
  const isAddressExist = defaultAddress.address !== null;
  const { isOpen, toggleModal } = useModalControl(false);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    isAddressExist ? 'list' : 'form',
  );
  const addressModalTitle = isAddressExist ? '주소 변경' : '주소 입력';

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
