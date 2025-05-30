'use client';
import { useCallback, useState } from 'react';

export function useDropdownMenu(onChange: (text: string) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleSelected = useCallback(
    (text: string) => onChange(text),
    [onChange],
  );

  const handleEditable = useCallback(
    (isEdit: boolean) => setIsEditable(isEdit),
    [],
  );

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement | HTMLLIElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    },
    [],
  );

  const autoFocus = useCallback((node: HTMLInputElement | null) => {
    if (node) node?.focus();
  }, []);

  return {
    isOpen,
    isEditable,
    handleEditable,
    handleSelected,
    handleToggle,
    handleClose,
    handleKeyDown,
    autoFocus,
    handleBlur,
  };
}
