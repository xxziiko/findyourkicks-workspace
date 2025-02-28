import { fetchNaverData } from '@/app/lib/api';
import { Header } from '@/components';
import Image from 'next/image';
import { Suspense } from 'react';
import Loading from './loading';
import ProductList from './ui/ProductList';

const fetchForSSG = async (page = 1) => await fetchNaverData(page);

export default async function Home() {
  const initialProducts = await fetchForSSG();

  return (
    <div className="flex flex-col max-w-7xl ml-auto mr-auto min-h-screen gap-16 sm:pl-8 sm:pr-8 font-sans">
      <Header />

      <main>
        <Suspense fallback={<Loading />}>
          <ProductList initialProducts={initialProducts} />
        </Suspense>
      </main>

      <footer className="border bg-black h-44 flex justify-center items-center">
        <div>
          <Image
            src="/findyourkicks-stroke.png"
            width={150}
            height={30}
            alt="logo"
          />
        </div>
      </footer>
    </div>
  );
}
