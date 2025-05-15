import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

export function useResentOrdersQuery() {
  return useSuspenseQuery(orderQueries.resent());
}
