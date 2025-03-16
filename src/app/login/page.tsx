import styles from '@/app/login/page.module.scss';
import { LoginCard } from './_features';

export default function Login() {
  return (
    <div className={styles.layout}>
      <LoginCard />
    </div>
  );
}
