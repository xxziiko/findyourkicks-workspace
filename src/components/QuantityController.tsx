import type { InventoryItem, QuantityHandlerType } from '@/lib/types';
import Button from './Button';
import styles from './QuantityController.module.scss';

export type QuantityControllerProps = {
  id: string;
  size: string;
  quantity: number;
  inventory: InventoryItem[];
  onQuantityChange: QuantityHandlerType;
};

export default function QuantityController({
  id,
  quantity,
  size,
  inventory,
  onQuantityChange,
}: QuantityControllerProps) {
  const getCurrentStock = (id: string) =>
    inventory.find(({ size, stock }) => id === size)?.stock;

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
        disabled={quantity === getCurrentStock(size)}
        text="+"
        variant="lined--small"
      />
    </div>
  );
}
