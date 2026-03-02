import { StarRating } from '@/features/review/components';
import type { RatingSummary } from '@/features/review/types';
import styles from './Description.module.scss';

export default function Description({
  brand,
  price,
  title,
  description,
  category,
  rating,
}: {
  brand: string;
  price: number;
  title: string;
  description: string;
  category: string;
  rating?: RatingSummary;
}) {
  return (
    <div className={styles.description}>
      <div>
        <p className={styles.description__brand}>{brand}</p>
        <p className={styles.description__price}>
          {Number(price).toLocaleString()} 원
        </p>
      </div>

      <div>
        <p>{title}</p>
        {rating && (
          <div className={styles.description__rating}>
            <StarRating value={rating.average} readonly size="sm" />
            <span className={styles.description__ratingScore}>
              {rating.average.toFixed(1)}
            </span>
            <span className={styles.description__ratingCount}>
              ({rating.count})
            </span>
          </div>
        )}
        <p className={styles.description__subtitle}>
          {`${brand} > ${category}`}
        </p>

        <p className={styles.description__text}>{description}</p>
      </div>
    </div>
  );
}
