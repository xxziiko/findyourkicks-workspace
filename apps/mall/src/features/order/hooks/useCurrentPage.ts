'use client';
import { useState } from 'react';

export function useCurrentPage(page: number) {
  const [currentPage, setCurrentPage] = useState(page);

  const updateCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    updateCurrentPage,
  };
}
