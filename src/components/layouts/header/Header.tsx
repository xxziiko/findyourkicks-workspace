'use client';

import { CartNavLink } from '@/components';
import useHeader from '@/components/layouts/header/useHeader';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header() {
  const { userEmail, handleLogout } = useHeader();

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image src="/findyourkicks.png" width={200} height={30} alt="logo" />
      </Link>

      <div className={styles.tabs}>
        {userEmail && (
          <div className={styles.tabs}>
            <p>{userEmail.split('@')[0]}님</p>
            <p>마이페이지</p>
            <CartNavLink />
          </div>
        )}

        {userEmail && (
          <button onClick={handleLogout} type="button">
            LOGOUT
          </button>
        )}

        {!userEmail && (
          <div className={styles['tabs__tab--bold']}>
            <Link href="/login">LOGIN</Link>
          </div>
        )}
      </div>
    </header>
  );
}
