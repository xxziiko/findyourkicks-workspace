'use client';

import { CartNavBtn } from '@/shared/components';
import { PATH } from '@/shared/constants/path';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { useHeader } from './useHeader';

export function Header() {
  const { userEmail, handleLogout } = useHeader();
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/images/findyourkicks.png"
          width={200}
          height={30}
          alt="logo"
          className={styles.header__logo}
        />
      </Link>

      <div className={styles.tabs}>
        {userEmail && (
          <div className={styles.tabs}>
            <p className={styles.tabs__user}>{userEmail.split('@')[0]}님</p>
            <Link href={PATH.myOrders}>MY PAGE</Link>
            <CartNavBtn />
          </div>
        )}

        {userEmail && (
          <button
            onClick={() => {
              handleLogout();
              router.push(PATH.home);
            }}
            type="button"
          >
            LOGOUT
          </button>
        )}

        {!userEmail && (
          <div className={styles['tabs__tab--bold']}>
            <Link href={PATH.login}>LOGIN</Link>
          </div>
        )}
      </div>
    </header>
  );
}
