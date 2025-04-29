import { Option } from '@/features/product';
import type { SelectedOption, InventoryItem } from '@/features/product/types';

export default function OptionList({
  selectedOptions,
  onQuantityChange,
  onDelete,
  price,
  inventory,
}: {
  selectedOptions: SelectedOption[];
  onQuantityChange: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  price: number;
  inventory: InventoryItem[];
}) {
  return (
    <ul>
      {selectedOptions.map(({ size, quantity }) => (
        <Option
          key={size}
          size={size}
          quantity={quantity}
          price={price}
          inventory={inventory}
          onQuantityChange={onQuantityChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
