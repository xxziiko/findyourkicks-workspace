import { checkReviewEligibility, fetchReviews } from '@/features/review/api';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

export const reviewQueries = {
  all: () => ['review'] as const,
  list: (productId: string) =>
    infiniteQueryOptions({
      queryKey: [...reviewQueries.all(), 'list', productId] as const,
      queryFn: ({ pageParam }) =>
        fetchReviews(productId, pageParam as string | undefined),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      refetchOnWindowFocus: false,
    }),
  eligibility: (productId: string) =>
    queryOptions({
      queryKey: [...reviewQueries.all(), 'eligibility', productId] as const,
      queryFn: () => checkReviewEligibility(productId),
      staleTime: 60_000,
    }),
};
