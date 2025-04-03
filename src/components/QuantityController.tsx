import type { InventoryItem, QuantityHandlerType } from '@/lib/types';
import Button from './Button';
import styles from './QuantityController.module.scss';

export type QuantityControllerProps = {
  id: string;
  quantity: number;
  inventory: InventoryItem;
  onQuantityChange: QuantityHandlerType;
};

export default function QuantityController({
  id,
  quantity,
  inventory,
  onQuantityChange,
}: QuantityControllerProps) {
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
        disabled={quantity === inventory.stock}
        text="+"
        variant="lined--small"
      />
    </div>
  );
}
