'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback reset={resetErrorBoundary} />
          )}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
