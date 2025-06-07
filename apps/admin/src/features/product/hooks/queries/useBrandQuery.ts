import { useSuspenseQuery } from '@tanstack/react-query';
import { productQueries } from '../queries';

export function useBrandQuery() {
  return useSuspenseQuery(productQueries.brand());
}
