import { ReactNode } from 'react';
import styles from './OrderListLayout.module.scss';
import { formatDateDefault } from '@/shared/utils/date';

interface OrderListLayoutProps {
  children: ReactNode;
  orderDate: string;
  url: string;
}

export function OrderListLayout({ children, orderDate, url }: OrderListLayoutProps) {
  return (
    <section className={styles.section}>
      <OrderHead orderDate={orderDate} url={url} />
      {children}
    </section>
  );
}

interface OrderHeadProps {
  orderDate: string;
  url: string;
}

function OrderHead({ orderDate, url }: OrderHeadProps) {
  return (
    <div className={styles.section__head}>
      <h4>{formatDateDefault(orderDate)}</h4>
      {/* <Link href={url}>주문 상세</Link> */}
    </div>
  );
}