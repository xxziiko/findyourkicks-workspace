import { Loader } from 'lucide-react';
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <Loader className={styles.loader} />
      </div>
    </div>
  );
}
