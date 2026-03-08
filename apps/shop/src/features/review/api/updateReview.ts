import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import type { Review, UpdateReviewRequest } from '../types';

const updateReview = (reviewId: string, body: UpdateReviewRequest) => {
  return api.patch<Review, UpdateReviewRequest>(
    `${ENDPOINTS.reviews}/${reviewId}`,
    body,
  );
};

export { updateReview };
