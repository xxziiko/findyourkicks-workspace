import '@/lib/styles/global.scss';
import { Header } from '@/shared/components/layouts';
import { createClient } from '@/shared/utils/supabase/server';
import { Provider } from 'jotai';
import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './layout.module.scss';
import { AuthListener, UserInitializer } from './login/_auth';
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
        <div id="modal-root" />
        <Providers>
          <Provider>
            <UserInitializer user={user} />
            <AuthListener />
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
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
