export interface Review {
  reviewId: string;
  userId: string;
  productId: string;
  rating: number;
  content: string | null;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: 'NOT_PURCHASED' | 'ALREADY_REVIEWED';
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CreateReviewRequest {
  rating: number;
  content?: string;
  imageUrls?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
  imageUrls?: string[];
}
