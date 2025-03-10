'use client';

import { signOutUser } from '@/app/lib/api';
import { cartItemsAtom, userAtom } from '@/app/lib/store';
import { Tab, TabGroup, TabList } from '@headlessui/react';
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
          <Image
            className="cursor-pointer"
            src="/findyourkicks.png"
            width={200}
            height={30}
            alt="logo"
          />
        </Link>
      </div>

      <TabGroup>
        <TabList className={styles.tabs}>
          {user?.email && (
            <TabGroup className={styles.tabs}>
              <Tab>{user.email?.split('@')[0]}님</Tab>
              <Tab>마이페이지</Tab>
            </TabGroup>
          )}

          <Tab className={styles.tabs__tab}>
            <p>CART</p>
            {!!items.length && <Badge quantity={items.length} />}
          </Tab>

          {user?.email ? (
            <Tab onClick={handleLogout}>LOGOUT</Tab>
          ) : (
            <Tab className={styles['tabs__tab--bold']}>
              <Link href="/login">LOGIN</Link>
            </Tab>
          )}
        </TabList>
      </TabGroup>
    </header>
  );
}
