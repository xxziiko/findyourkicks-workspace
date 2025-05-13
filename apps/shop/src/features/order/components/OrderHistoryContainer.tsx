'use client';

import MyOrdersLoading from '@/app/(shop)/my/orders/loading';
import { OrderHistoryList } from '@/features/order';
import type { OrderHistory } from '@/features/order/types';
import { ErrorFallback } from '@findyourkicks/shared';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface OrderHistoryContainerProps {
  history: OrderHistory;
}

export default function OrderHistoryContainer({
  history,
}: OrderHistoryContainerProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback reset={resetErrorBoundary} />
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
