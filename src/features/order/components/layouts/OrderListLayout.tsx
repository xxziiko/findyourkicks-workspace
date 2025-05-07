import styles from './OrderListLayout.module.scss';
import { formatDateDefault } from '@/shared/utils/date';

export function OrderListLayout({ children, orderDate, url }: { children: React.ReactNode, orderDate: string, url: string }) {
  return <section className={styles.section}>
    <OrderHead orderDate={orderDate} url={url} />
    {children}
    </section>;
}

function OrderHead({ orderDate, url }: { orderDate: string; url: string }) {
  return (
    <div className={`${styles.section__head}`}>
      <h4>{formatDateDefault(orderDate)}</h4>
      {/* <Link href={url}>주문 상세</Link> */}
    </div>
  );
}