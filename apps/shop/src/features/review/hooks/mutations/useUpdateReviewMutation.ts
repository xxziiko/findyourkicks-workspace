import { updateReview } from '@/features/review/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateReviewRequest } from '../../types';
import { reviewQueries } from '../queries/reviewQueries';

type UpdateReviewVariables = {
  reviewId: string;
  productId: string;
} & UpdateReviewRequest;

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      productId: _productId,
      ...body
    }: UpdateReviewVariables) => updateReview(reviewId, body),
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
