import { CardSkeleton } from '@/shared/components';
import Skeleton from 'react-loading-skeleton';
import styles from './ProductListLoading.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const mockArray = Array.from({ length: 100 }, (_, i) => i);

export function ProductListLoading() {
  return (
    <div>
      <div className={styles.list}>
        {mockArray.map((key) => (
          <CardSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
