import { useCallback, useState } from 'react';

export default function useDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('메세지를 선택해주세요');

  const handleSelectedText = (text: string) => {
    setSelectedText(text);
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
  };
}
