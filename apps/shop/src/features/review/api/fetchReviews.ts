import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const reviewSchema = z.object({
  reviewId: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number(),
  content: z.string().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const reviewsResponseSchema = z.object({
  reviews: z.array(reviewSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
});

type ReviewsResponseRaw = z.infer<typeof reviewsResponseSchema>;

const fetchReviews = async (productId: string, cursor?: string) => {
  const params = new URLSearchParams({ limit: '10' });
  if (cursor) {
    params.set('cursor', cursor);
  }

  return await api
    .get<ReviewsResponseRaw>(
      `${ENDPOINTS.products}/${productId}/reviews?${params.toString()}`,
    )
    .then((res) => reviewsResponseSchema.parse(res));
};

export { fetchReviews };
