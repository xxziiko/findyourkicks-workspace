import { fetchOrders } from './apis';
import type { OrderListResponse } from './types';
import { keepPreviousData } from '@tanstack/react-query';

export const orderKeys = {
  all: ['order'] as const,
  list: (page: number) => [...orderKeys.all, 'list', page] as const,
};

export const orderQueries = {
  list: (page: number, initialValues: OrderListResponse) => {
    return {
      queryKey: orderKeys.list(page),
      queryFn: () => fetchOrders(page),
      initialData: initialValues,
      placeholderData: keepPreviousData,
      enabled: page > 1,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      throwOnError: true,
    };
  },
  prefetchOrders: (page: number) => {
    return {
      queryKey: orderKeys.list(page),
      queryFn: () => fetchOrders(page),
    };
  },
};
