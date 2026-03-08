'use client';

import { Suspense } from 'react';
import { useProductReviewsQuery } from '../hooks/queries/useProductReviewsQuery';
import ReviewCard from './ReviewCard';
import styles from './ReviewList.module.scss';

interface ReviewListProps {
  productId: string;
}

function ReviewListContent({ productId }: ReviewListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductReviewsQuery(productId);

  const reviews = data.pages.flatMap((page) => page.reviews);

  if (reviews.length === 0) {
    return <p className={styles.empty}>아직 리뷰가 없습니다.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {reviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>

      {hasNextPage && (
        <button
          type="button"
          className={styles.more}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}

export default function ReviewList({ productId }: ReviewListProps) {
  return (
    <Suspense
      fallback={<p className={styles.loading}>리뷰를 불러오는 중...</p>}
    >
      <ReviewListContent productId={productId} />
    </Suspense>
  );
}
