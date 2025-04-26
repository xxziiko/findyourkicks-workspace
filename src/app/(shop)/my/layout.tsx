import { MyTabs } from '@/shared/components/layouts';
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
