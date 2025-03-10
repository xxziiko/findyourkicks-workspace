import { createClient } from '@/app/lib/utils/supabase/server';
import { Header } from '@/components';
import { Provider } from 'jotai';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AuthListener, UserInitializer } from './login/auth';
import { Providers } from './providers';
import '@/styles/global.scss';
import styles from './layout.module.scss';

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
            <UserInitializer user={user} />
            <AuthListener />
            <div className={styles.container}>
              <Header />

              <main className={styles.main}>{children}</main>

              <footer className={styles.footer}>
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
