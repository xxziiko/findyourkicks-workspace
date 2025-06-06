import { formatDateDefault } from '@findyourkicks/shared';
import type { ReactNode } from 'react';
import styles from './OrderListLayout.module.scss';

interface OrderListLayoutProps {
  children: ReactNode;
  orderDate: string;
  url: string;
}

export function OrderListLayout({
  children,
  orderDate,
  url,
}: OrderListLayoutProps) {
  return (
    <article className={styles.article}>
      <section className={styles.section}>
        <OrderHead orderDate={orderDate} url={url} />
        {children}
      </section>
    </article>
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
