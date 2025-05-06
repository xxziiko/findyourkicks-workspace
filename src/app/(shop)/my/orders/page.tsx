import { OrderHistoryList, fetchOrderHistory } from '@/features/order';
import { getCookieString } from '@/shared/utils';
import { Suspense } from 'react';
import MyOrdersLoading from '@/app/(shop)/my/loading';

export default async function MyOrdersPage() {
  const orderHistory = await getOrderHistory();

  return (
    <div>
      <h2>주문/배송 내역</h2>

      <Suspense fallback={<MyOrdersLoading />}>
        <OrderHistoryList history={orderHistory} />
      </Suspense>
    </div>
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
