'use client';

import {
  orderQueries,
  useCurrentPage,
  useOrderHistoryQuery,
} from '@/features/order';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useOrderPagination(page = 1) {
  const queryClient = useQueryClient();

  const { currentPage, updateCurrentPage } = useCurrentPage(page);
  const { data: orderHistory } = useOrderHistoryQuery({
    page: currentPage,
  });

  const handlePageChange = (page: number) => {
    updateCurrentPage(page);
    queryClient.prefetchQuery(orderQueries.history(page));
    queryClient.invalidateQueries({
      queryKey: orderQueries.history(page).queryKey,
    });
  };

  useEffect(() => {
    if (currentPage === 1) return;

    scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  return {
    orderHistory,
    handlePageChange,
  };
}
