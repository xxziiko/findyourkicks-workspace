import { Tab, TabGroup, TabList } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
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
          <Tab>CART</Tab>
          <Tab className="font-medium">LOGIN</Tab>
        </TabList>
      </TabGroup>
    </header>
  );
}
