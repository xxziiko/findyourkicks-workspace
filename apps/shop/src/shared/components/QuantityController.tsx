import type { InventoryItem } from '@/features/product/types';
import { Button } from '@findyourkicks/shared';
import styles from './QuantityController.module.scss';

export type QuantityControllerProps = {
  id: string;
  quantity: number;
  inventory: InventoryItem;
  onQuantityChange: (id: string, quantity: number) => void;
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
        variant="secondary"
        radius
        size="small"
      >
        -
      </Button>

      <p>{quantity}</p>
      <Button
        onClick={() => onQuantityChange(id, quantity + 1)}
        disabled={quantity === inventory.stock}
        variant="secondary"
        radius
        size="small"
      >
        +
      </Button>
    </div>
  );
}
