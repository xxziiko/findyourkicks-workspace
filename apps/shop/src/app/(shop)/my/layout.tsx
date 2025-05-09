import { MyTabs } from '@/features/user/my';
import styles from './layout.module.scss';

export default function MyPageLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <MyTabs />
      <div>
        <h2>주문 내역</h2>

        <div>{children}</div>
      </div>
    </div>
  );
}
