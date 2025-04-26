'use client';

import { CartNavLink } from '@/shared/components';
import useHeader from '@/shared/components/layouts/header/useHeader';
import { PATH } from '@/shared/constants/path';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';

export default function Header() {
  const { userEmail, handleLogout } = useHeader();
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image src="/findyourkicks.png" width={200} height={30} alt="logo" />
      </Link>

      <div className={styles.tabs}>
        {userEmail && (
          <div className={styles.tabs}>
            <p>{userEmail.split('@')[0]}님</p>
            <Link href={PATH.myOrders}>마이페이지</Link>
            <CartNavLink />
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
