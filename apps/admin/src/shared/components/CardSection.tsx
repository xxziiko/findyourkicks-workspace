import type { PropsWithChildren, ReactNode } from 'react';
import styles from './CardSection.module.scss';
import { NoData } from './NoData';

interface TableCardProps<T> {
  title: string;
  data: T[];
  tableHeader: readonly string[];
  renderRow: (item: T) => ReactNode;
}

interface CardSectionProps extends PropsWithChildren {
  title?: string;
}
export function CardSection({ children, title }: CardSectionProps) {
  return (
    <section className={styles.card}>
      {title && <h3>{title}</h3>}

      {children}
    </section>
  );
}

function TableCard<T extends { id: string }>({
  title,
  data,
  tableHeader,
  renderRow,
}: TableCardProps<T>) {
  return (
    <CardSection title={title}>
      <div className={styles.list}>
        <div className={styles.listHeader}>
          {tableHeader.map((header) => (
            <p key={header}>{header}</p>
          ))}
        </div>

        {data.length === 0 && <NoData text="최근 주문 내역이 없습니다." />}

        {data.map((item) => (
          <div key={item.id}>{renderRow(item)}</div>
        ))}
      </div>
    </CardSection>
  );
}

interface CardListItemProps extends PropsWithChildren {
  subTitle: string;
}
function CardListItem({ subTitle, children }: CardListItemProps) {
  return (
    <div className={styles.cardItem}>
      <span>{subTitle}</span>
      {children}
    </div>
  );
}

CardSection.TableCard = TableCard;
CardSection.ListItem = CardListItem;
