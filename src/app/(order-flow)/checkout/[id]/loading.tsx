import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './page.module.scss';

export default function LoadingCheckout() {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        <Skeleton width="100%" height={282} />
        <Skeleton width="100%" height={400} />
      </div>
      <div className={styles.layout__right}>
        <Skeleton width="100%" height={384} />
        <Skeleton width="100%" height={41} />
      </div>
    </div>
  );
}
