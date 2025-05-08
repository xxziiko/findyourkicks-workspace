'use client';

import { ReactNode, Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@/app/error';

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
} 

export default function AsyncBoundary({ children, fallback  }: AsyncBoundaryProps) {
return (
  <QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorPage reset={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>
)
}
