'use client';

import { OrderHistoryList } from '@/features/order';
import type { OrderHistory } from '@/features/order/types';
import { Suspense } from 'react';
import MyOrdersLoading from '@/app/(shop)/my/loading';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@/app/error';

interface OrderHistoryContainerProps {
  history: OrderHistory;
}

export default function OrderHistoryContainer({ history }: OrderHistoryContainerProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorPage reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<MyOrdersLoading />}>
            <OrderHistoryList history={history} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
} 