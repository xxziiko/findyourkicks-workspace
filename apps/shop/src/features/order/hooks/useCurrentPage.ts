'use client';
import { useCallback, useState } from 'react';

export function useCurrentPage(page: number) {
  const [currentPage, setCurrentPage] = useState(page);

  const updateCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    updateCurrentPage,
  };
}
