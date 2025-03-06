'use client';

import { signOutUser } from '@/app/lib/api';
import { cartItems } from '@/app/lib/store';
import Loading from '@/app/loading';
import { useSessionQuery } from '@/hooks';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import type { User } from '@supabase/supabase-js';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';

export default function Header({
  initialSession,
}: { initialSession: User | null }) {
  const [items, setItems] = useAtom(cartItems);
  const {
    isLoading,
    data: session,
    refetch,
  } = useSessionQuery({ initialSession });

  const handleLogout = async () => {
    await signOutUser();
    await refetch();
    setItems([]);
  };

  if (isLoading) return <Loading />;

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

          {session?.email ? (
            <TabGroup className="flex gap-2 text-sm">
              <Tab className="font-medium">
                {session.email?.split('@')[0]}님
              </Tab>
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
