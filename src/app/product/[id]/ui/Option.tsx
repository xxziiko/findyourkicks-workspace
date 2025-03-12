import { QuantityController } from '@/components';
import type { OptionProps } from '@/types/product';
import { CircleX } from 'lucide-react';
import { memo } from 'react';
import styles from './Option.module.scss';

const Option = ({
  size,
  quantity,
  price,
  onDeleteButtonClick,
  ...props
}: OptionProps) => {
  return (
    <li key={size} className={styles.option}>
      <p className={styles.option__size}>{size}</p>
      <QuantityController {...props} size={size} quantity={quantity} />

      <div className={styles.option__price_box}>
        <p className={styles.option__price}>
          {(price * quantity).toLocaleString()} 원
        </p>

        <CircleX
          className={styles['option__button--delete']}
          width={18}
          onClick={() => onDeleteButtonClick(size)}
        />
      </div>
    </li>
  );
};

export default memo(Option);
