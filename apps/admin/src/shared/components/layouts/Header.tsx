import { useSignOutMutation } from '@/features/auth';
import { PATH } from '@/shared';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

export function Header({ text }: { text?: string }) {
  const navigate = useNavigate();
  const { mutate: signOut } = useSignOutMutation();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate(PATH.login);
      },
    });
  };
  return (
    <header className={styles.header}>
      <h2>{text}</h2>
      <button type="button" onClick={handleSignOut} aria-label="로그아웃">
        로그아웃
      </button>
    </header>
  );
}
