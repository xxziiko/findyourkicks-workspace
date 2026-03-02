import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { z } from 'zod';

const reviewEligibilitySchema = z.object({
  canReview: z.boolean(),
  reason: z.enum(['NOT_PURCHASED', 'ALREADY_REVIEWED']).optional(),
});

type ReviewEligibilityRaw = z.infer<typeof reviewEligibilitySchema>;

const checkReviewEligibility = async (productId: string) => {
  return await api
    .get<ReviewEligibilityRaw>(
      `${ENDPOINTS.products}/${productId}/reviews/eligibility`,
    )
    .then((res) => reviewEligibilitySchema.parse(res));
};

export { checkReviewEligibility };
