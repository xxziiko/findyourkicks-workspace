import { OrderHistoryList, fetchOrderHistory } from '@/features/order';
import { getCookieString } from '@/shared/utils';
import { Suspense } from 'react';
import MyOrdersLoading from '@/app/(shop)/my/loading';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@/app/error';



export default async function MyOrdersPage() {
  const orderHistory = await getOrderHistory();

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
          <OrderHistoryList history={orderHistory} />
          </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
  );
}

async function getOrderHistory(page = 1) {
  const cookieString = await getCookieString();
  return await fetchOrderHistory(page, {
    headers: {
      Cookie: cookieString,
    },
  });
}
