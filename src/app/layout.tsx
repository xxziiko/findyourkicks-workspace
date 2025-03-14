import '@/styles/global.scss';
import { createClient } from '@/app/lib/utils/supabase/server';
import { Header } from '@/widgets';
import { Provider } from 'jotai';
import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './layout.module.scss';
import { AuthListener, UserInitializer } from './login/auth';
import { Providers } from './providers';

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
                <figure>
                  <Image
                    src="/findyourkicks-stroke.png"
                    width={170}
                    height={30}
                    alt="logo"
                  />
                </figure>
              </footer>
            </div>
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
