import { SIZE_INVENTORY } from '@/app/lib/constants';
import type { QuantityHandler, SelectedOption } from '@/types/product';
import Button from './Button';
import styles from './QuantityController.module.scss';

export type QuantityControllerProps = QuantityHandler & SelectedOption;

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
        onClick={onDecrement}
        disabled={!quantity}
        text="-"
        variant="lined--small"
      />

      <p>{quantity}</p>
      <Button
        onClick={onIncrement}
        disabled={quantity === maxStock(size)}
        text="+"
        variant="lined--small"
      />
    </div>
  );
}
