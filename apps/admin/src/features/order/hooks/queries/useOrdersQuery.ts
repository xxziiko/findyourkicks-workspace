import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

export function useOrdersQuery() {
  return useSuspenseQuery(orderQueries.list());
}
