import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { Header } from '@/components';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'SHOP | findyourkicks',
  description: 'find your kicks',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex flex-col justify-between max-w-7xl ml-auto mr-auto min-h-screen gap-16 pl-8 pr-8 font-sans ">
            <Header />

            <main className="w-full h-full">{children}</main>

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
        </Providers>
      </body>
    </html>
  );
}
