'use client';

import { cartItems } from '@/app/lib/store';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import Badge from './Badge';

export default function Header() {
  const items = useAtomValue(cartItems);

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
          <Tab className="font-medium">LOGIN</Tab>
        </TabList>
      </TabGroup>
    </header>
  );
}
