import { QuantityController } from '@/components';
import type { InventoryItem, SelectedOption } from '@/features/product/types';
import { CircleX } from 'lucide-react';
import { memo } from 'react';
import styles from './Option.module.scss';

interface OptionProps extends SelectedOption {
  price: number;
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const Option = ({
  size,
  quantity,
  price,
  onDelete,
  inventory,
  ...props
}: OptionProps) => {
  return (
    <li key={size} className={styles.option}>
      <p className={styles.option__size}>{size}</p>
      <QuantityController
        {...props}
        id={size}
        quantity={quantity}
        inventory={inventory.filter((item) => item.size === size)[0]}
      />

      <div className={styles.option__price_box}>
        <p className={styles.option__price}>
          {(price * quantity).toLocaleString()} 원
        </p>

        <CircleX
          className={styles['option__button--delete']}
          width={18}
          onClick={() => onDelete(size)}
        />
      </div>
    </li>
  );
};

export default memo(Option);
