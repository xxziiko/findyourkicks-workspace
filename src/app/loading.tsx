import { Loader } from 'lucide-react';
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.background}>
      <Loader color="#fff" />
    </div>
  );
}
