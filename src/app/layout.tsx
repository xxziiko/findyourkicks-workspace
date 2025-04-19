import '@/shared/styles/global.scss';
import { AuthListener } from '@/features/auth';
import { Header } from '@/shared/components/layouts';
import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './layout.module.scss';
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
  return (
    <html lang="ko">
      <body>
        <div id="modal-root" />
        <Providers>
          <AuthListener />
          <Header />

          <main className={styles.main}>{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
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
  );
}
