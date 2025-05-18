'use client';
import MyOrdersLoading from '@/app/(shop)/my/orders/loading';
import {
  OrderListLayout,
  OrderProduct,
  useOrderPagination,
} from '@/features/order';
import { PATH } from '@/shared/constants/path';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Suspense } from 'react';
import styles from './OrderHistoryList.module.scss';

export default function OrderHistoryList() {
  const { orderHistory, handlePageChange } = useOrderPagination();
  const { currentPage, hasNext, orders, lastPage } = orderHistory;
  const pageList = Array.from({ length: lastPage }, (_, index) => index + 1);

  return (
    <div>
      <Suspense fallback={<MyOrdersLoading />}>
        <article className={styles.article}>
          {orders.map(({ orderDate, orderId, products }) => (
            <OrderListLayout
              key={orderId}
              orderDate={orderDate}
              url={`${PATH.myOrders}/${orderId}`}
            >
              {products.map((product) => (
                <OrderProduct key={product.id} product={product} type="order" />
              ))}
            </OrderListLayout>
          ))}
        </article>
      </Suspense>

      <div className={styles.pagination}>
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? styles.button__disabled : ''}
        >
          <ChevronFirst />
        </button>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? styles.button__disabled : ''}
        >
          <ChevronLeft />
        </button>

        {pageList.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? styles.button__active : ''}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          className={currentPage === lastPage ? styles.button__disabled : ''}
        >
          <ChevronRight />
        </button>

        <button
          type="button"
          onClick={() => handlePageChange(lastPage)}
          disabled={currentPage === lastPage}
          className={currentPage === lastPage ? styles.button__disabled : ''}
        >
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}
