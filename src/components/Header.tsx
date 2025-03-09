'use client';

import { signOutUser } from '@/app/lib/api';
import { cartItemsAtom, userAtom } from '@/app/lib/store';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';

export default function Header() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [user, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setItems([]);
  };

  return (
    <header className="sticky top-0 left-0 w-full bg-white z-50 h-20 flex justify-between items-center">
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
        <TabList className="flex gap-2 text-sm">
          <Tab className="relative">
            <p>CART</p>
            {!!items.length && <Badge quantity={items.length} />}
          </Tab>

          {user?.email ? (
            <TabGroup className="flex gap-2 text-sm">
              <Tab className="font-medium">{user.email?.split('@')[0]}님</Tab>
              <Tab>마이페이지</Tab>
              <Tab onClick={handleLogout}>LOGOUT</Tab>
            </TabGroup>
          ) : (
            <Tab className="font-medium">
              <Link href="/login">LOGIN</Link>
            </Tab>
          )}
        </TabList>
      </TabGroup>
    </header>
  );
}
