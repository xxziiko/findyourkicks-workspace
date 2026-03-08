'use client';
import type { ProductFilters } from '@/features/product/types';
import styles from './FilterChips.module.scss';

interface FilterChipsProps {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters, value?: string) => void;
  onClear: () => void;
}

export function FilterChips({ filters, onRemove, onClear }: FilterChipsProps) {
  const chips: { label: string; key: keyof ProductFilters; value?: string }[] =
    [];

  if (filters.q) {
    chips.push({ label: `검색: ${filters.q}`, key: 'q' });
  }
  if (filters.brand) {
    for (const b of filters.brand) {
      chips.push({ label: `브랜드: ${b}`, key: 'brand', value: b });
    }
  }
  if (filters.category) {
    for (const c of filters.category) {
      chips.push({ label: `카테고리: ${c}`, key: 'category', value: c });
    }
  }
  if (filters.size) {
    for (const s of filters.size) {
      chips.push({ label: `사이즈: ${s}`, key: 'size', value: s });
    }
  }
  if (filters.minPrice !== undefined) {
    chips.push({
      label: `최저가: ${filters.minPrice.toLocaleString()}원`,
      key: 'minPrice',
    });
  }
  if (filters.maxPrice !== undefined) {
    chips.push({
      label: `최고가: ${filters.maxPrice.toLocaleString()}원`,
      key: 'maxPrice',
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {chips.map((chip, i) => (
        <span key={i} className={styles.chip}>
          {chip.label}
          <button
            type="button"
            className={styles.chip__remove}
            onClick={() => onRemove(chip.key, chip.value)}
            aria-label={`${chip.label} 필터 제거`}
          >
            ×
          </button>
        </span>
      ))}
      <button type="button" className={styles.clearBtn} onClick={onClear}>
        전체 초기화
      </button>
    </div>
  );
}
