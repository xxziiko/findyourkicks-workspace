'use client';
import type { SortOption } from '@/features/product/types';
import styles from './SortSelect.module.scss';

interface SortSelectProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
  { value: 'popular', label: '인기순' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      aria-label="정렬 방식"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
