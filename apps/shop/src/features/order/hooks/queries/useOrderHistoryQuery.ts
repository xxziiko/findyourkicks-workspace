import type { OrderHistory } from '@/features/order/types';
import { handleError } from '@findyourkicks/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

export function useOrderHistoryQuery({
  page,
  initialValues,
}: {
  page: number;
  initialValues: OrderHistory;
}) {
  const { error, ...rest } = useSuspenseQuery({
    ...orderQueries.history(page),
    initialData: initialValues,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });

  return handleError({ data: rest, error });
}
