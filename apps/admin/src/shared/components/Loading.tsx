import { Loader } from 'lucide-react';
import styles from './Loading.module.scss';

export function Loading() {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Loader className={styles.loader} />
      </div>
    </div>
  );
}
