import { SIZE_INVENTORY } from '@/lib/constants';
import type { QuantityHandlerType } from '@/lib/types';
import Button from './Button';
import styles from './QuantityController.module.scss';

export type QuantityControllerProps = {
  id: string;
  size: string;
  quantity: number;
  onQuantityChange: QuantityHandlerType;
};

export default function QuantityController({
  id,
  quantity,
  size,
  onQuantityChange,
}: QuantityControllerProps) {
  const maxStock = (selectedSize: string) =>
    SIZE_INVENTORY.find(({ size }) => size === selectedSize)?.stock;

  return (
    <div className={styles.controller}>
      <Button
        onClick={() => onQuantityChange(id, quantity - 1)}
        disabled={!quantity}
        text="-"
        variant="lined--small"
      />

      <p>{quantity}</p>
      <Button
        onClick={() => onQuantityChange(id, quantity + 1)}
        disabled={quantity === (maxStock(size) ?? 3)}
        text="+"
        variant="lined--small"
      />
    </div>
  );
}
