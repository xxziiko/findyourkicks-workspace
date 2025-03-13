import { SIZE_INVENTORY } from '@/app/lib/constants';
import { productItemAtom } from '@/app/lib/store';
import type { CartItem, ProductItem, SelectedOption } from '@/types/product';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';

export default function useSelectedOptions() {
  const item = useAtomValue<ProductItem | null>(productItemAtom);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const price = Number(item?.lprice);

  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const inventory = SIZE_INVENTORY.map((inv) => {
    const selected = selectedOptions.find((opt) => opt.size === inv.size);
    return selected ? { ...inv, stock: inv.stock - selected.quantity } : inv;
  });

  const handleSelectSize = useCallback(
    (size: number) => () => {
      setSelectedOptions((prev) => {
        const index = prev.findIndex((option) => option.size === size);
        if (index !== -1) {
          return prev.map((option, i) =>
            i === index ? { ...option, quantity: option.quantity + 1 } : option,
          );
        }
        return [...prev, { size, quantity: 1 }];
      });
    },
    [],
  );

  const handleDeleteButton = useCallback(
    (size: number) => () => {
      setSelectedOptions((prev) =>
        prev.filter((option) => option.size !== size),
      );
    },
    [],
  );

  const handleIncrementButton = useCallback(
    (size: number) => () => {
      const initialStock =
        SIZE_INVENTORY.find((item) => item.size === size)?.stock ?? 0;

      setSelectedOptions((prev) =>
        prev.map((option) =>
          option.size === size && option.quantity < initialStock
            ? { ...option, quantity: option.quantity + 1 }
            : option,
        ),
      );
    },
    [],
  );

  const handleDecrementButton = useCallback(
    (size: number) => () => {
      setSelectedOptions((prev) =>
        prev.map((option) =>
          option.size === size && option.quantity > 1
            ? { ...option, quantity: option.quantity - 1 }
            : option,
        ),
      );
    },
    [],
  );

  const resetSelectedOptions = () => {
    setSelectedOptions([]);
  };

  const createCart = () => {
    return selectedOptions.map(
      (option) =>
        ({
          ...option,
          cartId: crypto.randomUUID(),
          productId: item?.productId,
          imageUrl: item?.image,
          title: item?.title,
          price,
        }) as CartItem,
    );
  };

  return {
    item,
    price,
    selectedOptions,
    totalQuantity,
    inventory,

    handleSelectSize,
    handleDeleteButton,
    handleIncrementButton,
    handleDecrementButton,
    resetSelectedOptions,
    createCart,
  };
}
