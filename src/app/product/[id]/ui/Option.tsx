import { QuantityController } from '@/components';
import type { QuantityHandler, SelectedOption } from '@/types/product';
import { CircleX } from 'lucide-react';
import { memo } from 'react';
import styles from './Option.module.scss';

interface OptionBase extends SelectedOption {
  price: number;
  onDelete: () => void;
}

type OptionProps = OptionBase & QuantityHandler;

const Option = ({ size, quantity, price, onDelete, ...props }: OptionProps) => {
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
          onClick={onDelete}
        />
      </div>
    </li>
  );
};

export default memo(Option);
