import { useCallback, useState } from 'react';

export function useDropdownMenu(setSelected: (text: string) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleSelected = (text: string) => {
    setSelected(text);
  };

  const handleEditable = (isEdit: boolean) => setIsEditable(isEdit);

  const handleClose = () => setIsOpen(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLUListElement | HTMLLIElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

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
