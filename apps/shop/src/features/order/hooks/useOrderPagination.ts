'use client';

import {
  orderQueries,
  useCurrentPage,
  useOrderHistoryQuery,
} from '@/features/order';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { OrderHistory } from '../types';

export function useOrderPagination({
  initialOrderHistory,
}: {
  initialOrderHistory: OrderHistory;
}) {
  const queryClient = useQueryClient();

  const { currentPage: initialCurrentPage, lastPage: initialLastPage } =
    initialOrderHistory;
  const { currentPage, updateCurrentPage } = useCurrentPage(initialCurrentPage);

  const { data: orderHistory } = useOrderHistoryQuery({
    page: currentPage,
    initialValues: initialOrderHistory,
  });

  const handlePageChange = (page: number) => {
    updateCurrentPage(page);
    queryClient.prefetchQuery(orderQueries.history(page));
    queryClient.invalidateQueries({
      queryKey: orderQueries.history(page).queryKey,
    });
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(initialLastPage);
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
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleLastPage,
  };
}
