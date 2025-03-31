'use client';

import { CartBadge } from '@/components';
import useHeader from '@/components/layouts/header/useHeader';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header() {
  const { items, userEmail, handleLogout, handleCartButton } = useHeader();

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
          </div>
        )}

        <button
          type="button"
          className={styles.tabs__tab}
          onClick={handleCartButton}
          disabled={!userEmail}
        >
          CART
          {!!items.length && <CartBadge quantity={items.length} />}
        </button>

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
