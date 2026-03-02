import { productQueries } from '@/features/product/hooks/queries/productQueries';
import { createReview } from '@/features/review/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateReviewRequest } from '../../types';
import { reviewQueries } from '../queries/reviewQueries';

type CreateReviewVariables = { productId: string } & CreateReviewRequest;

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, ...body }: CreateReviewVariables) =>
      createReview(productId, body),
    onSuccess: (_data, variables) => {
      const { productId } = variables;
      queryClient.invalidateQueries({
        queryKey: reviewQueries.list(productId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: reviewQueries.eligibility(productId).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: productQueries.all() });
    },
  });
}
