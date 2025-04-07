import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './page.module.scss';

export default function LoadingCart() {
  return (
    <div className={styles.section}>
      <Skeleton width="100%" height={50} />
      <Skeleton width="100%" height={383} />
      <Skeleton width="100%" height={222} />
      <Skeleton width="100%" height={41} />
    </div>
  );
}
