import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { reviewQueries } from './reviewQueries';

export function useProductReviewsQuery(productId: string) {
  return useSuspenseInfiniteQuery(reviewQueries.list(productId));
}
