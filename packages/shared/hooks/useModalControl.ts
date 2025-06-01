'use client';
import { useCallback, useState } from 'react';

export function useModalControl(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggleModal, closeModal };
}
