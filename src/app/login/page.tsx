import styles from '@/app/login/page.module.scss';
import { LoginCard } from './ui';

export default function Login() {
  return (
    <div className={styles.layout}>
      <LoginCard />
    </div>
  );
}
