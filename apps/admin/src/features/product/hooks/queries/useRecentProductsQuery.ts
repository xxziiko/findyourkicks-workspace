import { useSuspenseQuery } from '@tanstack/react-query';
import { productQueries } from './productQueries';

const LIMIT = 5;

export function useRecentProductsQuery() {
  return useSuspenseQuery(productQueries.recent(LIMIT));
}
