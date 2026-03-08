import type { Review } from '../types';
import styles from './ReviewCard.module.scss';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { rating, content, imageUrls, createdAt } = review;

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <StarRating value={rating} readonly size="sm" />
        <span className={styles.card__date}>{formattedDate}</span>
      </div>

      {content && <p className={styles.card__content}>{content}</p>}

      {imageUrls.length > 0 && (
        <div className={styles.card__images}>
          {imageUrls.map((url, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={url}
              alt={`리뷰 이미지 ${index + 1}`}
              className={styles.card__image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
