import { useCallback, useState } from 'react';

export default function useDropdownMenu(
  selectedText: string,
  setSelectedText: (text: string) => void,
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedText = (text: string) => {
    setSelectedText(text);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setSelectedText(e.target.value);
  };

  const handleDropdown = () => {
    setIsOpen((prev) => !prev);
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
    selectedText,
    handleSelectedText,
    handleDropdown,
    handleKeyDown,
    autoFocus,
    handleBlur,
  };
}
