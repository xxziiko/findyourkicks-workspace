'use client';
import { useEffect, useState } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (q: string) => void;
}

export function SearchBar({ defaultValue = '', onSearch }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="브랜드, 상품명 검색"
        aria-label="상품 검색"
      />
    </div>
  );
}
