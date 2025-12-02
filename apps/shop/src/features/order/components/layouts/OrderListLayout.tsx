import { formatDateDefault } from '@findyourkicks/shared';
import Link from 'next/link';
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
      <Link href={url} className={styles.link}>
        <section className={styles.section}>
          <OrderHead orderDate={orderDate} />
          {children}
        </section>
      </Link>
    </article>
  );
}

interface OrderHeadProps {
  orderDate: string;
}

function OrderHead({ orderDate }: OrderHeadProps) {
  return (
    <div className={styles.section__head}>
      <h4>{formatDateDefault(orderDate)}</h4>
    </div>
  );
}
