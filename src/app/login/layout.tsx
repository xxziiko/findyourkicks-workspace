import { CardLayout } from '@/components/layouts';
import styles from './layout.module.scss';

export const dynamic = 'force-static';

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <CardLayout type="primary--bold">
        <div className={styles.inner}>
          <h3 className={styles.inner__title}>
            🚀 3초 만에, <br /> 간편하게 시작해요!
          </h3>
          <div className={styles.inner__buttons}>{children}</div>
        </div>
      </CardLayout>
    </div>
  );
}
