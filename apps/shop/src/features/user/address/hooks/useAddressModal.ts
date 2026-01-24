'use client';

import type { UserAddressNullable } from '@/features/user/address';
import { useModalControl } from '@findyourkicks/shared';
import { useCallback, useMemo, useState } from 'react';

export function useAddressModal(defaultAddress: UserAddressNullable) {
  const isAddressExist = Boolean(
    defaultAddress?.addressId &&
      defaultAddress?.address &&
      defaultAddress?.address.trim() !== '',
  );

  const { isOpen, toggleModal } = useModalControl(false);

  const initialView = useMemo(
    () => (isAddressExist ? 'list' : 'form'),
    [isAddressExist],
  );

  const [modalView, setModalView] = useState<'form' | 'list'>(initialView);

  const addressModalTitle = isAddressExist ? '주소 변경' : '주소 입력';

  const switchToFormView = useCallback(() => setModalView('form'), []);

  const closeModal = useCallback(() => {
    toggleModal();
    setModalView(initialView);
  }, [toggleModal, initialView]);

  return {
    isModalOpen: isOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,
  };
}
