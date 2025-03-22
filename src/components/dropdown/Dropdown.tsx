'use client';
import { ChevronDown } from 'lucide-react';
import { createContext, useContext } from 'react';
import styles from './Dropdown.module.scss';
import useDropdownMenu from './useDropdownMenu';

type DropdownContextType = {
  onSelectText: (text: string) => void;
  onSelectKeyDown: (
    e: React.KeyboardEvent<HTMLUListElement | HTMLLIElement>,
  ) => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

export default function Dropdown({
  children,
  variant,
}: { children: React.ReactNode; variant?: 'border' }) {
  const {
    isOpen,
    selectedText,
    handleSelectedText,
    handleDropdown,
    handleKeyDown,
    autoFocus,
  } = useDropdownMenu();

  const value = {
    onSelectText: handleSelectedText,
    onSelectKeyDown: handleKeyDown,
  };

  return (
    <DropdownContext.Provider value={value}>
      <ul
        className={styles[`drop_down_${variant}`] ?? styles.drop_down}
        onClick={handleDropdown}
        onKeyDown={handleKeyDown}
      >
        <li className={styles.drop_down__header}>
          {selectedText === '직접 입력' ? (
            <input ref={autoFocus} />
          ) : (
            <p>{selectedText}</p>
          )}
          <ChevronDown />
        </li>

        {isOpen && children}
      </ul>
    </DropdownContext.Provider>
  );
}

function Item({
  text = '',
  children,
}: { text?: string; children?: React.ReactNode }) {
  const { onSelectText, onSelectKeyDown } = useDropdown();

  return (
    <li
      className={styles.item}
      onClick={() => onSelectText(text)}
      onKeyDown={(e) => onSelectKeyDown(e)}
    >
      {text && <p>{text}</p>}
      {children && children}
    </li>
  );
}

Dropdown.Item = Item;

function useDropdown(): DropdownContextType {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
}
