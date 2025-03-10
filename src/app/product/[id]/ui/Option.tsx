import { SIZE_INVENTORY } from '@/app/lib/constants';
import type { OptionProps } from '@/types/product';
import { Button } from '@headlessui/react';
import { CircleX } from 'lucide-react';
import { memo } from 'react';
import styles from './Option.module.scss';

const Option = ({
  size,
  quantity,
  price,
  onIncrementButtonClick,
  onDecrementButtonClick,
  onDeleteButtonClick,
}: OptionProps) => {
  const maxStock = (selectedSize: number) =>
    SIZE_INVENTORY.find(({ size }) => size === selectedSize)?.stock;

  return (
    <li key={size} className={styles.option}>
      <p className={styles.option__size}>{size}</p>
      <div className={styles.option__quantity}>
        <Button
          className={styles.option__button}
          onClick={() => onDecrementButtonClick(size)}
          disabled={!quantity}
        >
          -
        </Button>
        <p>{quantity}</p>
        <Button
          className={styles.option__button}
          onClick={() => onIncrementButtonClick(size)}
          disabled={quantity === maxStock(size)}
        >
          +
        </Button>
      </div>

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
