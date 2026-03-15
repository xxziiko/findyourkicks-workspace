import { queryOptions } from '@tanstack/react-query';
import { getReturns } from '../../api';

export const returnQueries = {
  all: () => ['returns'] as const,
  list: (status?: string) =>
    queryOptions({
      queryKey: [...returnQueries.all(), 'list', status ?? 'all'] as const,
      queryFn: () => getReturns(status),
      refetchOnWindowFocus: false,
    }),
};
