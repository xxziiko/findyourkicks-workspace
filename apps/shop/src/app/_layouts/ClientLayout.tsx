'use client';
import { Header } from '@/app/_layouts';
import Loading from '@/app/loading';
import { AuthGuard } from '@/features/auth';
import { ErrorBoundary, GlobalPortal } from '@findyourkicks/shared';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './ClientLayout.module.scss';
import { Providers } from './providers';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Providers>
        <GlobalPortal.Provider>
          <Suspense fallback={<Loading />}>
            <AuthGuard>
              <Header />
              <main className={styles.main}>{children}</main>
              <Footer />
            </AuthGuard>
          </Suspense>
        </GlobalPortal.Provider>
      </Providers>
    </ErrorBoundary>
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
