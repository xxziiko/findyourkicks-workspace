import { MyTabs } from '@/features/user/my';
import styles from './layout.module.scss';

export default function MyPageLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <MyTabs />
      <div>{children}</div>
    </div>
  );
}
