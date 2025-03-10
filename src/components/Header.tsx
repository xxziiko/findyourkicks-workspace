'use client';

import { signOutUser } from '@/app/lib/api';
import { cartItemsAtom, userAtom } from '@/app/lib/store';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';
import styles from './Header.module.scss';

export default function Header() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [user, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setItems([]);
  };

  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <Image src="/findyourkicks.png" width={200} height={30} alt="logo" />
        </Link>
      </div>

      <div className={styles.tabs}>
        {user?.email && (
          <div className={styles.tabs}>
            <p>{user.email?.split('@')[0]}님</p>
            <p>마이페이지</p>
          </div>
        )}

        <div className={styles.tabs__tab}>
          <p>CART</p>
          {!!items.length && <Badge quantity={items.length} />}
        </div>

        {user?.email ? (
          <button onClick={handleLogout} type="button">
            LOGOUT
          </button>
        ) : (
          <div className={styles['tabs__tab--bold']}>
            <Link href="/login">LOGIN</Link>
          </div>
        )}
      </div>
    </header>
  );
}
