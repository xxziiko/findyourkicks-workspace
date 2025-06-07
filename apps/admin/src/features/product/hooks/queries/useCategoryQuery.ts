import { useSuspenseQuery } from '@tanstack/react-query';
import { productQueries } from '../queries';

export function useCategoryQuery() {
  return useSuspenseQuery(productQueries.category());
}
