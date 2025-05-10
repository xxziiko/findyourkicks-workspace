import cardStyles from '@/features/product/components/ProductCardBtn.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CardSkeleton() {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.card__content}>
        <Skeleton width="230px" height="230px" />

        <div className={cardStyles.card__details}>
          <Skeleton className={cardStyles['card__details--brand']} />
          <Skeleton className={cardStyles.card__price} />
          <Skeleton className={cardStyles.card__price} />
        </div>
      </div>
    </div>
  );
}
