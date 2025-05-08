import { OrderHistoryList, fetchOrderHistory } from '@/features/order';
import { getCookieString } from '@/shared/utils';
import { AsyncBoundary } from '@/shared/components/layouts';
import MyOrdersLoading from '@/app/(shop)/my/loading';

export default async function MyOrdersPage() {
  const orderHistory = await getOrderHistory();

  return (
    <AsyncBoundary fallback={<MyOrdersLoading />}>
      <OrderHistoryList history={orderHistory} />
    </AsyncBoundary>
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
