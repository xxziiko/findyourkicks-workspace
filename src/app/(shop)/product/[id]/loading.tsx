import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from '@/features/product/components/DetailView.module.scss';

export default function DetailLoading() {
  return (
    <div className={styles.detail}>
      <div className={styles.image__box}>
        <Skeleton width="24rem" height="24rem" />
      </div>

      <div className={styles.detail__divider} />

      <ContentSkeleton />
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className={styles.content}>
      <div className={styles.content__top}>
        <div>
          <Skeleton className={styles['content__top_text--brand']} />
          <Skeleton className={styles['content__top_text--price']} />
        </div>
      </div>

      <div>
        <Skeleton />
        <Skeleton className={styles['content__top_text--subtitle']} />
      </div>

      <div className={styles.content__top_options}>
        <Skeleton width={608} height={106} />
      </div>

      <div className={styles.content__bottom}>
        <div className={styles.content__bottom_wrapper}>
          <Skeleton width={608} height={64} />
        </div>

        <div className={styles.content__bottom_buttons}>
          <Skeleton width={608} height={41} />
          <Skeleton width={608} height={41} />
        </div>
      </div>
    </div>
  );
}
