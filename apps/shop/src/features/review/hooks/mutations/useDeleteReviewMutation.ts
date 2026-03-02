import { deleteReview } from '@/features/review/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewQueries } from '../queries/reviewQueries';

type DeleteReviewVariables = { reviewId: string; productId: string };

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }: DeleteReviewVariables) => deleteReview(reviewId),
    onSuccess: (_data, variables) => {
      const { productId } = variables;
      queryClient.invalidateQueries({
        queryKey: reviewQueries.list(productId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: reviewQueries.eligibility(productId).queryKey,
      });
    },
  });
}
