import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import type { CreateReviewRequest, Review } from '../types';

const createReview = (productId: string, body: CreateReviewRequest) => {
  return api.post<Review, CreateReviewRequest>(
    `${ENDPOINTS.products}/${productId}/reviews`,
    body,
  );
};

export { createReview };
