import { Header } from '@/components';
import { Provider } from 'jotai';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Providers } from './providers';
import './globals.css';
import { createClient } from '@/app/lib/utils/supabase/server';

export const metadata: Metadata = {
  title: 'SHOP | findyourkicks',
  description: 'find your kicks',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ko">
      <body>
        <Providers>
          <Provider>
            <div className="flex flex-col justify-between max-w-7xl ml-auto mr-auto min-h-screen gap-16 pl-8 pr-8 font-sans ">
              <Header initialSession={user} />

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
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
