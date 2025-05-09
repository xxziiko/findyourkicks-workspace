'use client';
import { useDropdownMenu } from '@/shared/hooks';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { createContext, useContext } from 'react';
import styles from './Dropdown.module.scss';

type DropdownContextType = {
  selected: string;
  isOpen: boolean;
  isEditable: boolean;
  onEdit: (isEdit: boolean) => void;
  onSelect: (text: string) => void;
  onToggle: () => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLUListElement | HTMLLIElement>) => void;
  autoFocus: (node: HTMLInputElement | null) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

export default function Dropdown({
  children,
  selected,
  variant,
  setSelected,
}: {
  children: React.ReactNode;
  variant?: 'border';
  selected: string;
  setSelected: (text: string) => void;
}) {
  const {
    isOpen,
    isEditable,
    handleSelected,
    handleEditable,
    handleClose,
    handleToggle,
    handleKeyDown,
    handleBlur,
    autoFocus,
  } = useDropdownMenu(setSelected);

  const value = {
    selected,
    isOpen,
    variant,
    isEditable,
    onEdit: handleEditable,
    onSelect: handleSelected,
    onToggle: handleToggle,
    onClose: handleClose,
    onKeyDown: handleKeyDown,
    autoFocus,
    onBlur: handleBlur,
  };

  return (
    <DropdownContext.Provider value={value}>
      <div className={styles[`drop-down__${variant}`] ?? styles['drop-down']}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function Trigger() {
  const { selected, isOpen, onToggle, isEditable } = useDropdown();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={styles['drop-down__trigger']}
    >
      {isEditable ? <Input /> : selected}
      {isOpen ? <ChevronUp /> : <ChevronDown />}
    </button>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  const { isOpen } = useDropdown();
  if (!isOpen) return null;

  return <ul className={styles['drop-down__menu']}>{children}</ul>;
}

function Item({
  text,
  editable = false,
}: { text: string; editable?: boolean }) {
  const { onSelect, onClose, onKeyDown, onEdit } = useDropdown();

  const handleSelect = () => {
    onSelect(text);
    onEdit(editable);
    onClose();
  };

  return (
    <li onClick={handleSelect} onKeyDown={onKeyDown}>
      <p>{text}</p>
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
      className={styles.input}
      ref={autoFocus}
      value={value}
      onChange={handleChangeText}
      onBlur={onBlur}
    />
  );
}

Dropdown.Item = Item;
Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;

function useDropdown(): DropdownContextType {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
}
