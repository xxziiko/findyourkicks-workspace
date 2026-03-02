'use client';
import type { FilterOptions, ProductFilters } from '@/features/product/types';
import styles from './FilterPanel.module.scss';

interface FilterPanelProps {
  filterOptions: FilterOptions;
  filters: ProductFilters;
  onChange: (f: ProductFilters) => void;
}

function toggleArrayValue(arr: string[] | undefined, value: string): string[] {
  if (!arr) return [value];
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterPanel({
  filterOptions,
  filters,
  onChange,
}: FilterPanelProps) {
  const handleBrand = (name: string) => {
    onChange({ ...filters, brand: toggleArrayValue(filters.brand, name) });
  };

  const handleCategory = (name: string) => {
    onChange({
      ...filters,
      category: toggleArrayValue(filters.category, name),
    });
  };

  const handleSize = (size: string) => {
    onChange({ ...filters, size: toggleArrayValue(filters.size, size) });
  };

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      minPrice: val === '' ? undefined : Number(val),
    });
  };

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      maxPrice: val === '' ? undefined : Number(val),
    });
  };

  return (
    <div className={styles.panel}>
      {filterOptions.brands.length > 0 && (
        <div className={styles.group}>
          <p className={styles.group__title}>브랜드</p>
          <div className={styles.group__list}>
            {filterOptions.brands.map((brand) => (
              <label key={brand.id} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={filters.brand?.includes(brand.name) ?? false}
                  onChange={() => handleBrand(brand.name)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {filterOptions.categories.length > 0 && (
        <div className={styles.group}>
          <p className={styles.group__title}>카테고리</p>
          <div className={styles.group__list}>
            {filterOptions.categories.map((cat) => (
              <label key={cat.id} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={filters.category?.includes(cat.name) ?? false}
                  onChange={() => handleCategory(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {filterOptions.sizes.length > 0 && (
        <div className={styles.group}>
          <p className={styles.group__title}>사이즈</p>
          <div className={styles.group__list}>
            {filterOptions.sizes.map((size) => (
              <label key={size} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={filters.size?.includes(size) ?? false}
                  onChange={() => handleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className={styles.group}>
        <p className={styles.group__title}>가격 범위</p>
        <div className={styles.priceRange}>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="최저가"
            value={filters.minPrice ?? ''}
            onChange={handleMinPrice}
            min={0}
          />
          <span className={styles.priceSep}>~</span>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="최고가"
            value={filters.maxPrice ?? ''}
            onChange={handleMaxPrice}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
