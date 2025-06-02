'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Children,
  type PropsWithChildren,
  createContext,
  useContext,
} from 'react';
import { useDropdownMenu, useInputValue } from '../hooks';
import styles from './Dropdown.module.scss';

type DropdownContextType = {
  selected: string;
  isOpen: boolean;
  isEditable: boolean;
  onEdit: (isEdit: boolean) => void;
  onSelect: (text: string) => void;
  onToggle: () => void;
  onClose: () => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    options: string[],
  ) => void;
  autoFocus: (node: HTMLInputElement | null) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  id?: string;
  focusedIndex: number;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown(): DropdownContextType {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
}

interface DropdownProps extends PropsWithChildren {
  selected: string;
  onChange: (text: string) => void;
  id?: string;
}

/**
 * Dropdown
 * - Compound Pattern으로 구성된 커스텀 드롭다운 컴포넌트
 * - Context를 통해 하위 컴포넌트들 간 상태 공유
 * @param children 하위 컴포넌트
 * @param selected 현재 선택된 값
 * @param variant 드롭다운 버전
 * @param onChange 값 변경 핸들러
 * @param id 드롭다운 아이디(테스트용)
 */
export function Dropdown({ children, selected, onChange, id }: DropdownProps) {
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
    focusedIndex,
  } = useDropdownMenu(onChange);

  const value = {
    selected,
    isOpen,
    isEditable,
    onEdit: handleEditable,
    onSelect: handleSelected,
    onToggle: handleToggle,
    onClose: handleClose,
    onKeyDown: handleKeyDown,
    autoFocus,
    onBlur: handleBlur,
    id,
    focusedIndex,
  };

  return (
    <DropdownContext.Provider value={value}>
      <div
        className={isOpen ? styles['drop-down--open'] : styles['drop-down']}
        data-testid={id}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

/**
 * Trigger
 * - 드롭다운을 열고 닫는 버튼 역할
 * - 선택된 값을 보여주거나, 입력 필드를 보여줌 (isEditable 상태에 따라)
 */
function Trigger() {
  const { selected, isOpen, onToggle, isEditable, id } = useDropdown();
  return (
    <button
      type="button"
      onClick={onToggle}
      role="combobox"
      aria-controls={id}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label="dropdown"
      className={styles['drop-down__trigger']}
    >
      {isEditable ? <Input /> : selected}
      {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </button>
  );
}

/**
 * Menu
 * - 드롭다운이 열렸을 때만 렌더링되는 메뉴 리스트 컨테이너
 * @param children 하위 컴포넌트
 */
function Menu({ children }: { children: React.ReactNode }) {
  const { isOpen, onKeyDown } = useDropdown();
  const options = Children.toArray(children).map(
    (child) => (child as any).props.text,
  );

  return (
    isOpen && (
      <div
        className={styles['drop-down__menu']}
        role="listbox"
        tabIndex={0}
        aria-label="dropdown options"
        aria-hidden={!isOpen}
        onKeyDown={(e) => onKeyDown(e, options)}
      >
        {children}
      </div>
    )
  );
}

/**
 * Item
 * - 드롭다운 메뉴에서 하나의 선택 항목
 * - 클릭 시 선택 값 반영 및 드롭다운 닫힘
 * @param text 선택 항목 텍스트
 * @param editable 입력 필드 표시 여부
 */
function Item({
  text,
  editable = false,
}: {
  text: string;
  editable?: boolean;
}) {
  const { onSelect, onClose, onEdit, selected, onKeyDown } = useDropdown();

  const handleSelect = () => {
    onSelect(text);
    onEdit(editable);
    onClose();
  };

  return (
    <div
      onClick={handleSelect}
      data-testid={text}
      role="option"
      tabIndex={0}
      aria-selected={selected === text}
      aria-label={text}
      className={styles['drop-down__item']}
      onKeyDown={(e) => onKeyDown(e, [text])}
    >
      <p>{text}</p>
    </div>
  );
}

/**
 * Input
 * - 선택된 항목을 수정할 수 있는 입력 필드
 * - isEditable 상태일 때만 Trigger 영역에 표시됨
 */
function Input() {
  const { autoFocus, onBlur } = useDropdown();
  const { value, handleChange } = useInputValue();

  return (
    <input
      className={styles.input}
      ref={autoFocus}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
}

Dropdown.Item = Item;
Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
