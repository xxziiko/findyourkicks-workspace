import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

const deleteReview = (reviewId: string) => {
  return api.delete<void>(`${ENDPOINTS.reviews}/${reviewId}`);
};

export { deleteReview };
