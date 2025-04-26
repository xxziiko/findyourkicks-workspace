import { MyOrders, fetchOrders } from '@/features/order';
import { getCookieString } from '@/shared/utils';

export default async function MyOrdersPage() {
  const preFetchOrders = await getOrders();


  return (
    <div>
      <h2>주문/배송 내역</h2>

      <MyOrders preFetchOrders={preFetchOrders} />
    </div>
  );
}

async function getOrders(page = 1) {
  const cookieString = await getCookieString();
  return await fetchOrders(page, {
    headers: {
      Cookie: cookieString,
    },
  });
}
