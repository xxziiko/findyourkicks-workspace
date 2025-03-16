import { ShoppingCartIcon } from 'lucide-react';
import styles from './NoListData.module.scss';

export default function NoListData() {
  return (
    <section className={styles.section}>
      <ShoppingCartIcon width="2rem" />
      <p>장바구니가 비어있어요!</p>
    </section>
  );
}
