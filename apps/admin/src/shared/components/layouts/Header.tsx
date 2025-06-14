import { useSignOutMutation } from '@/features/auth';
import { PATH } from '@/shared';
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

interface HeaderProps {
  text?: string;
  isOpenSidebar: boolean;
  toggleSidebar: () => void;
}

export function Header({ text, isOpenSidebar, toggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { mutate: signOut } = useSignOutMutation({
    onSuccess: () => {
      navigate(PATH.login);
    },
  });

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        {isOpenSidebar ? (
          <ArrowLeftFromLineIcon onClick={toggleSidebar} size={32} />
        ) : (
          <ArrowRightFromLineIcon onClick={toggleSidebar} size={32} />
        )}
        <h2>{text}</h2>
      </div>
      <button type="button" onClick={() => signOut()} aria-label="로그아웃">
        로그아웃
      </button>
    </header>
  );
}
