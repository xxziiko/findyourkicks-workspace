import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './layout.module.scss';

export default function Loading() {
  return (
    <div className={styles.card}>
      <Skeleton width={608} height={500} />
    </div>
  );
}
