import { CardSkeleton } from '@/shared/components';
import styles from './ProductListLoading.module.scss';

const mockArray = Array.from({ length: 100 }, (_, i) => i);

export function ProductListLoading() {
  return (
    <div className={styles.list}>
      {mockArray.map((key) => (
        <CardSkeleton key={key} />
      ))}
    </div>
  );
}
