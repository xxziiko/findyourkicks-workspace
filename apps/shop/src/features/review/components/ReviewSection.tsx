'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { reviewQueries } from '../hooks/queries/reviewQueries';
import type { RatingSummary } from '../types';
import RatingSummaryComponent from './RatingSummary';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import styles from './ReviewSection.module.scss';

interface ReviewSectionProps {
  productId: string;
  rating?: RatingSummary;
}

export default function ReviewSection({
  productId,
  rating,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const { data: eligibility } = useQuery(reviewQueries.eligibility(productId));

  return (
    <section className={styles.section}>
      <div className={styles.section__header}>
        <h2 className={styles.section__title}>리뷰</h2>

        {eligibility?.canReview && !showForm && (
          <button
            type="button"
            className={styles.section__writeBtn}
            onClick={() => setShowForm(true)}
          >
            리뷰 작성
          </button>
        )}

        {!eligibility?.canReview && eligibility?.reason === 'NOT_PURCHASED' && (
          <span className={styles.section__notice}>
            구매 후 작성 가능합니다.
          </span>
        )}

        {!eligibility?.canReview &&
          eligibility?.reason === 'ALREADY_REVIEWED' && (
            <span className={styles.section__notice}>
              이미 리뷰를 작성하셨습니다.
            </span>
          )}
      </div>

      {rating && <RatingSummaryComponent summary={rating} />}

      {showForm && (
        <div className={styles.section__form}>
          <ReviewForm
            productId={productId}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <ReviewList productId={productId} />
    </section>
  );
}
