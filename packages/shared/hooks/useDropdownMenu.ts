'use client';
import { useCallback, useState } from 'react';

export function useDropdownMenu(onChange: (text: string) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleSelected = useCallback(
    (text: string) => onChange(text),
    [onChange],
  );

  const handleEditable = useCallback(
    (isEdit: boolean) => setIsEditable(isEdit),
    [],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, options: string[]) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(
            (prev) => (prev - 1 + options.length) % options.length,
          );
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSelected(options[focusedIndex]);
            handleClose();
          }
          break;
      }
    },
    [handleClose, handleSelected, focusedIndex],
  );

  const autoFocus = useCallback((node: HTMLInputElement | null) => {
    if (node) node?.focus();
  }, []);

  return {
    isOpen,
    isEditable,
    focusedIndex,
    handleEditable,
    handleSelected,
    handleToggle,
    handleClose,
    handleKeyDown,
    autoFocus,
    handleBlur,
  };
}
