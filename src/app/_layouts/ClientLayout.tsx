'use client';
import { Header } from '@/app/_layouts';
import Image from 'next/image';
import { GlobalPortal } from './GlobalPortal';
import { AuthGuard } from '@/features/auth';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '../error';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import styles from './ClientLayout.module.scss';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorPage reset={resetErrorBoundary} />
          )}
        >
          <GlobalPortal.Provider>
            <AuthGuard>
              <Header />
              <main className={styles.main}>{children}</main>
              <Footer />
            </AuthGuard>
          </GlobalPortal.Provider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
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
