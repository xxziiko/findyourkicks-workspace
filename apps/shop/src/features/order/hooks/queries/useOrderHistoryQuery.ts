import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

export function useOrderHistoryQuery({
  page,
}: {
  page: number;
}) {
  return useSuspenseQuery({
    ...orderQueries.history(page),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });
}
