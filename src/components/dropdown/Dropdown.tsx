'use client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { createContext, useContext } from 'react';
import styles from './Dropdown.module.scss';
import useDropdownMenu from './useDropdownMenu';

type DropdownContextType = {
  onSelectText: (text: string) => void;
  onSelectKeyDown: (
    e: React.KeyboardEvent<HTMLUListElement | HTMLLIElement>,
  ) => void;
  autoFocus: (node: HTMLInputElement | null) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

export default function Dropdown({
  children,
  variant,
  selectedText,
  setSelectedText,
}: {
  children: React.ReactNode;
  variant?: 'border';
  selectedText: string;
  setSelectedText: (text: string) => void;
}) {
  const {
    isOpen,
    handleSelectedText,
    handleDropdown,
    handleKeyDown,
    handleBlur,
    autoFocus,
  } = useDropdownMenu(selectedText, setSelectedText);

  const value = {
    onSelectText: handleSelectedText,
    onSelectKeyDown: handleKeyDown,
    autoFocus,
    onBlur: handleBlur,
  };

  return (
    <DropdownContext.Provider value={value}>
      <ul
        className={styles[`drop-down_${variant}`] ?? styles['drop-down']}
        onClick={handleDropdown}
        onKeyDown={handleKeyDown}
      >
        <li className={styles['drop-down__header']}>
          {selectedText === '직접 입력' ? (
            <Dropdown.Input />
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

function Item({ text = '' }: { text?: string }) {
  const { onSelectText, onSelectKeyDown } = useDropdown();

  return (
    <li
      className={styles.item}
      onClick={() => onSelectText(text)}
      onKeyDown={(e) => onSelectKeyDown(e)}
    >
      {text && <p>{text}</p>}
    </li>
  );
}

function Input() {
  const { autoFocus, onBlur } = useDropdown();
  const [value, setValue] = useState('');

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      ref={autoFocus}
      value={value}
      onChange={handleChangeText}
      onBlur={onBlur}
    />
  );
}

Dropdown.Item = Item;
Dropdown.Input = Input;

function useDropdown(): DropdownContextType {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
}
