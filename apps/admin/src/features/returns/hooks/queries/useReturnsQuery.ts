import { useSuspenseQuery } from '@tanstack/react-query';
import { returnQueries } from './returnQueries';

export function useReturnsQuery(status?: string) {
  return useSuspenseQuery(returnQueries.list(status));
}
