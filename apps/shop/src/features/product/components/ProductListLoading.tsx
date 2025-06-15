import { CardSkeleton } from '@/shared/components';
import Skeleton from 'react-loading-skeleton';
import styles from './ProductListLoading.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const mockArray = Array.from({ length: 30 }, (_, i) => i);

export function ProductListLoading() {
  return (
    <div>
      <div className={styles.banner}>
        <Skeleton width="100%" height="400px" />
      </div>
      <div className={styles.list}>
        {mockArray.map((key) => (
          <CardSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
