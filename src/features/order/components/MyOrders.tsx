'use client';
import { OrderProduct, useOrderPagination } from '@/features/order';
import type { OrderListResponse } from '@/features/order/types';
import { formatDateDefault } from '@/shared/utils/date';
import Link from 'next/link';
import styles from './MyOrders.module.scss';
import { PATH } from '@/shared/constants/path';

export default function MyOrders({
  preFetchOrders,
}: {
  preFetchOrders: OrderListResponse;
}) {
  const { orderList, handlePreviousPage, handleNextPage, page } =
    useOrderPagination({
      prefetchData: preFetchOrders,
    });

  return (
    <div>
      <article className={styles.section}>
        {Object.entries(orderList.orders).map(([orderId, order]) => (
          <OrderListLayout key={orderId}>
            <OrderHead
              orderDate={order[0].orderDate}
              url={`${PATH.myOrders}/${orderId}`}
            />

            {order.map((order) => (
              <OrderProduct
                product={order.product}
                type="order"
                key={order.product.id}
              />
            ))}
          </OrderListLayout>
        ))}
      </article>

      <div className={styles.section__pagination}>
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={!orderList.hasMore}
        >
          다음
        </button>
      </div>
    </div>
  );
}

function OrderListLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.section__item}>{children}</section>;
}

function OrderHead({ orderDate, url }: { orderDate: string; url: string }) {
  return (
    <div className={` ${styles.item__head}`}>
      <h4>{formatDateDefault(orderDate)}</h4>
      <Link href={url}>주문 상세</Link>
    </div>
  );
}
