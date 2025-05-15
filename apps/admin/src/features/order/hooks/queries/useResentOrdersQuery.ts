import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from './orderQueries';

const LIMIT = 5;

export function useResentOrdersQuery() {
  return useSuspenseQuery(orderQueries.resent(LIMIT));
}
