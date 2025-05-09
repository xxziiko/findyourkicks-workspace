import { OrderHistoryList, fetchOrderHistory } from '@/features/order';
import { getCookieString } from '@/shared/utils';

export default async function MyOrdersPage() {
  const orderHistory = await getOrderHistory();

  return <OrderHistoryList history={orderHistory} />;
}

async function getOrderHistory(page = 1) {
  const cookieString = await getCookieString();
  return await fetchOrderHistory(page, {
    headers: {
      Cookie: cookieString,
    },
  });
}
