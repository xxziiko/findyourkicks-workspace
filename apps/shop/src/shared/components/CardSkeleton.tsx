import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './CardSkeleton.module.scss';

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <Skeleton className={styles.card__image} />

        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </div>
  );
}
