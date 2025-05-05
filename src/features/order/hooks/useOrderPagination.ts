'use client';

import { useQuery } from '@tanstack/react-query';
import { orderQueries } from '../queries';
import type { OrderListResponse } from '../types';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function useOrderPagination({
  prefetchData,
}: {
  prefetchData: OrderListResponse;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: orderList } = useQuery(orderQueries.list(page, prefetchData));

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
    queryClient.prefetchQuery(orderQueries.prefetchOrders(page - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => (orderList.hasMore ? prev + 1 : prev));
    queryClient.prefetchQuery(orderQueries.prefetchOrders(page + 1));
  };

  useEffect(() => {
    scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  return {
    page,
    orderList,
    handlePreviousPage,
    handleNextPage,
  };
}
