import { handleError } from '@findyourkicks/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

export function useOrderHistoryQuery({
  page,
}: {
  page: number;
}) {
  const { error, ...rest } = useSuspenseQuery({
    ...orderQueries.history(page),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });

  return handleError({ data: rest, error });
}
