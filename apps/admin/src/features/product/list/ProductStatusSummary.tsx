import {
  PRODUCT_STATUS,
  type Status,
  useProductStatusQuery,
} from '@/features/product';
import { CardSection } from '@/shared/components';
import { commaizeNumberWithUnit } from '@findyourkicks/shared';
import styles from './ProductStatusSummary.module.scss';

export function ProductStatusSummary() {
  const { data: statuses } = useProductStatusQuery();

  return (
    <CardSection>
      <div className={styles.sellerStatus}>
        {PRODUCT_STATUS.map(({ id, title }) => (
          <div key={id}>
            <p>{title}</p>
            <p>{commaizeNumberWithUnit(statuses[id as Status], '개')}</p>
          </div>
        ))}
      </div>
    </CardSection>
  );
}
