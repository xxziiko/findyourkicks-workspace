import { SIZE_INVENTORY } from '@/app/lib/constants';
import type { QuantityControllerProps } from '@/types/product';
import Button from './Button';
import styles from './QuantityController.module.scss';

export default function QuantityController({
  quantity,
  size,
  onIncrement,
  onDecrement,
}: QuantityControllerProps) {
  const maxStock = (selectedSize: number) =>
    SIZE_INVENTORY.find(({ size }) => size === selectedSize)?.stock;

  return (
    <div className={styles.controller}>
      <Button
        onClick={() => onIncrement(size)}
        disabled={!quantity}
        text="-"
        variant="lined--small"
      />

      <p>{quantity}</p>
      <Button
        onClick={() => onDecrement(size)}
        disabled={quantity === maxStock(size)}
        text="+"
        variant="lined--small"
      />
    </div>
  );
}
