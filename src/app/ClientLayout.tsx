'use client';
import { Header } from '@/shared/components/layouts';
import Image from 'next/image';
import styles from './layout.module.scss';
import { GlobalPortal } from './GlobalPortal';
import { AuthGuard } from '@/features/auth';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalPortal.Provider>
      <AuthGuard>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </AuthGuard>
    </GlobalPortal.Provider>
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
