'use client';
import { productQueries } from '@/features/product/hooks/queries/productQueries';
import useProductList from '@/features/product/hooks/useProductList';
import type { ProductFilters, SortOption } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { FilterChips } from './FilterChips';
import { FilterPanel } from './FilterPanel';
import ProductCardBtn from './ProductCardBtn';
import styles from './ProductSearchPage.module.scss';
import { SearchBar } from './SearchBar';
import { SortSelect } from './SortSelect';

export function ProductSearchPage() {
  const {
    productList,
    filters,
    setFilters,
    clearFilters,
    isFetchingNextPage,
    handleFetchNextPage,
    hasNextPage,
    handleImageLoad,
  } = useProductList();

  const { data: filterOptions } = useQuery(productQueries.filterOptions());

  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (q: string) => {
    setFilters({ ...filters, q: q || undefined });
  };

  const handleSort = (sort: SortOption) => {
    setFilters({ ...filters, sort });
  };

  const handleFilterChange = (nextFilters: ProductFilters) => {
    setFilters(nextFilters);
  };

  const handleRemoveChip = (key: keyof ProductFilters, value?: string) => {
    if (key === 'brand' || key === 'category' || key === 'size') {
      const current = filters[key] ?? [];
      const next = value ? current.filter((v) => v !== value) : [];
      setFilters({
        ...filters,
        [key]: next.length > 0 ? next : undefined,
      });
    } else {
      const next = { ...filters };
      delete next[key];
      setFilters(next);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <SearchBar defaultValue={filters.q ?? ''} onSearch={handleSearch} />
        <div className={styles.toolbar__actions}>
          <button
            type="button"
            className={styles.filterToggle}
            onClick={() => setShowFilter((v) => !v)}
          >
            필터 {showFilter ? '닫기' : '열기'}
          </button>
          <SortSelect value={filters.sort ?? 'latest'} onChange={handleSort} />
        </div>
      </div>

      {showFilter && filterOptions && (
        <FilterPanel
          filterOptions={filterOptions}
          filters={filters}
          onChange={handleFilterChange}
        />
      )}

      <FilterChips
        filters={filters}
        onRemove={handleRemoveChip}
        onClear={clearFilters}
      />

      <div className={styles.grid}>
        {productList.map(({ productId, image, brand, title, price }) => (
          <Link
            href={`/product/${productId}`}
            key={productId}
            className={styles.grid__item}
          >
            <ProductCardBtn
              src={image}
              brand={brand}
              title={title}
              price={price}
              onAllImageLoad={handleImageLoad}
            />
          </Link>
        ))}
      </div>

      {productList.length === 0 && (
        <p className={styles.empty}>검색 결과가 없습니다.</p>
      )}

      {hasNextPage && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={handleFetchNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
