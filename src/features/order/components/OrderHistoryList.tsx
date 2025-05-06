'use client';
import { OrderProduct, useOrderPagination } from '@/features/order';
import type { OrderHistory } from '@/features/order/types';
import { formatDateDefault } from '@/shared/utils/date';
import styles from './OrderHistoryList.module.scss';
import { PATH } from '@/shared/constants/path';
import { ChevronRight, ChevronLeft, ChevronLast, ChevronFirst } from 'lucide-react';

export default function OrderHistoryList({
  history,
}: {
  history: OrderHistory;
}) {
  const { orderHistory, handlePageChange, handleNextPage, handlePreviousPage, handleFirstPage, handleLastPage } =
    useOrderPagination({
      initialOrderHistory: history,
    });
  const { currentPage, hasNext, orders, lastPage } = orderHistory;
  const pageList = Array.from({ length: lastPage }, (_, index) => index + 1);
  

  
  return (
    <div>
      <article className={styles.article}>
        {orders.map(({ orderDate, orderId, products }) => (
          <OrderListLayout key={orderId}>
            <OrderHead
              orderDate={orderDate}
              url={`${PATH.myOrders}/${orderId}`}
            />

            {products.map((product) => (
              <OrderProduct
                product={product}
                type="order"
                key={product.id}
              />
            ))}
          </OrderListLayout>
        ))}
      </article>

      <div className={styles.pagination}>
        <button type="button" onClick={handleFirstPage} disabled={currentPage === 1} className={currentPage === 1 ? styles.button__disabled : ''}>
          <ChevronFirst />
        </button>

        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={ currentPage === 1}
          className={currentPage === 1 ? styles.button__disabled : ''}
        >
          <ChevronLeft  />
        </button>

        {pageList.map((pageNumber) => (
          <button key={pageNumber} type="button" onClick={() => handlePageChange(pageNumber)} className={currentPage === pageNumber ? styles.button__active : ''}>
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={handleNextPage}
          disabled={!hasNext}
          className={currentPage === lastPage ? styles.button__disabled : ''}
        >
          <ChevronRight />
        </button>

        <button type="button" onClick={handleLastPage} disabled={currentPage === lastPage} className={currentPage === lastPage ? styles.button__disabled : ''}>
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}


function OrderListLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.section}>{children}</section>;
}

function OrderHead({ orderDate, url }: { orderDate: string; url: string }) {
  return (
    <div className={`${styles.section__head}`}>
      <h4>{formatDateDefault(orderDate)}</h4>
      {/* <Link href={url}>주문 상세</Link> */}
    </div>
  );
}
