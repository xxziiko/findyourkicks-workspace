import { SearchIcon } from 'lucide-react';
import styles from './NoData.module.scss';

export function NoData({ text }: { text?: string }) {
  return (
    <div className={styles.container}>
      <SearchIcon width={20} height={20} />
      <p className={styles.text}>{text ?? '데이터가 없습니다.'}</p>
    </div>
  );
}
