import type { PropsWithChildren, ReactNode } from 'react';
import styles from './DashboardCard.module.scss';

interface CardSectionProps<T> {
  title: string;
  data: T[];
  tableHeader: readonly string[];
  renderRow: (item: T) => ReactNode;
}

export function DashboardCard({ children }: PropsWithChildren) {
  return <section className={styles.card}>{children}</section>;
}

export function TableCard<T extends { id: string }>({
  title,
  data,
  tableHeader,
  renderRow,
}: CardSectionProps<T>) {
  return (
    <DashboardCard>
      <h3>{title}</h3>

      <div className={styles.list}>
        <div className={styles.listHeader}>
          {tableHeader.map((header) => (
            <p key={header}>{header}</p>
          ))}
        </div>

        {data.map((item) => (
          <div key={item.id}>{renderRow(item)}</div>
        ))}
      </div>
    </DashboardCard>
  );
}

DashboardCard.TableCard = TableCard;
