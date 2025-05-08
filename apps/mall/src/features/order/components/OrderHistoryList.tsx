'use client';
import { OrderProduct, useOrderPagination, OrderListLayout } from '@/features/order';
import type { OrderHistory } from '@/features/order/types';
import styles from './OrderHistoryList.module.scss';
import { PATH } from '@/shared/constants/path';
import { ChevronRight, ChevronLeft, ChevronLast, ChevronFirst } from 'lucide-react';

interface OrderHistoryListProps {
  history: OrderHistory;
}

export default function OrderHistoryList({ history }: OrderHistoryListProps) {
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
          <OrderListLayout 
            key={orderId} 
            orderDate={orderDate} 
            url={`${PATH.myOrders}/${orderId}`}
          >
            {products.map((product) => (
              <OrderProduct
                key={product.id}
                product={product}
                type="order"
              />
            ))}
          </OrderListLayout>                
        ))}
      </article>

      <div className={styles.pagination}>
        <button 
          type="button" 
          onClick={handleFirstPage} 
          disabled={currentPage === 1} 
          className={currentPage === 1 ? styles.button__disabled : ''}
        >
          <ChevronFirst />
        </button>

        <button
          type="button"
          onClick={handlePreviousPage}
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
          onClick={handleNextPage}
          disabled={!hasNext}
          className={currentPage === lastPage ? styles.button__disabled : ''}
        >
          <ChevronRight />
        </button>

        <button 
          type="button" 
          onClick={handleLastPage} 
          disabled={currentPage === lastPage} 
          className={currentPage === lastPage ? styles.button__disabled : ''}
        >
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}


