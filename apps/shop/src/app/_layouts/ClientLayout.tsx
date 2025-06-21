'use client';

import { Header, Providers } from '@/app/_layouts';
import { AuthGuard } from '@/features/auth';
import { ErrorBoundary, GlobalPortal } from '@findyourkicks/shared';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './ClientLayout.module.scss';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalPortal.Provider>
      <ErrorBoundary>
        <Providers>
          <Suspense fallback={null}>
            <AuthGuard>
              <Header />
              <main className={styles.main}>{children}</main>
              <Footer />
            </AuthGuard>
          </Suspense>
        </Providers>
      </ErrorBoundary>
    </GlobalPortal.Provider>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <figure>
        <Image
          src="/images/findyourkicks-stroke.png"
          width={170}
          height={30}
          alt="logo"
        />
      </figure>
    </footer>
  );
}
