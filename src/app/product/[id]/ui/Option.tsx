import { SIZE_INVENTORY } from '@/app/lib/constants';
import type { OptionProps } from '@/types/product';
import { Button } from '@headlessui/react';
import { CircleX } from 'lucide-react';
import { memo } from 'react';

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
    <li
      key={size}
      className="flex justify-between py-5 item-center w-full border-b"
    >
      <p className="w-full">{size}</p>
      <div className="flex gap-5 w-full justify-center">
        <Button
          className="border px-2 rounded-lg  disabled:bg-gray-200 disabled:text-gray-500"
          onClick={() => onDecrementButtonClick(size)}
          disabled={!quantity}
        >
          -
        </Button>
        <p>{quantity}</p>
        <Button
          className="border px-2 rounded-lg  disabled:bg-gray-200 disabled:text-gray-500"
          onClick={() => onIncrementButtonClick(size)}
          disabled={quantity === maxStock(size)}
        >
          +
        </Button>
      </div>

      <div className="flex gap-2  w-full justify-end">
        <p className="font-bold">{(price * quantity).toLocaleString()} 원</p>

        <CircleX
          className="cursor-pointer"
          width={18}
          onClick={() => onDeleteButtonClick(size)}
        />
      </div>
    </li>
  );
};

export default memo(Option);
