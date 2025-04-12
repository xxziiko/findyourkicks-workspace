import cardStyles from '@/app/product/_features/ProductCardBtn.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProductListLoading.module.scss';

const mockArray = Array.from({ length: 100 }, (_, i) => i);

export default function CardListLoading() {
  return (
    <div className={styles.list}>
      {mockArray.map((key) => (
        <CardSkeleton key={key} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.card__content}>
        <Skeleton width="13rem" height="13rem" />

        <div className={cardStyles.card__details}>
          <Skeleton className={cardStyles['card__details--brand']} />
          <Skeleton />
        </div>

        <div>
          <Skeleton className={cardStyles.card__price} />
          <Skeleton className={cardStyles.card__sub} />
        </div>
      </div>
    </div>
  );
}
