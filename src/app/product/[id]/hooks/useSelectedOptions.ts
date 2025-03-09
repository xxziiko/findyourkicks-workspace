import { SIZE_INVENTORY } from '@/app/lib/constants';
import { useCallback, useMemo, useState } from 'react';

export default function useSelectedOptions() {
  const [selectedOptions, setSelectedOptions] = useState<
    { size: number; quantity: number }[]
  >([]);

  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const inventory = useMemo(
    () =>
      SIZE_INVENTORY.map((inv) => {
        const selected = selectedOptions.find((opt) => opt.size === inv.size);
        return selected
          ? { ...inv, stock: inv.stock - selected.quantity }
          : inv;
      }),
    [selectedOptions],
  );

  const selectSize = (size: number) => {
    setSelectedOptions((prev) => {
      const index = prev.findIndex((option) => option.size === size);
      if (index !== -1) {
        return prev.map((option, i) =>
          i === index ? { ...option, quantity: option.quantity + 1 } : option,
        );
      }
      return [...prev, { size, quantity: 1 }];
    });
  };

  const deleteOption = useCallback((size: number) => {
    setSelectedOptions((prev) => prev.filter((option) => option.size !== size));
  }, []);

  const incrementQuantity = useCallback((size: number) => {
    const initialStock =
      SIZE_INVENTORY.find((item) => item.size === size)?.stock ?? 0;

    setSelectedOptions((prev) =>
      prev.map((option) =>
        option.size === size && option.quantity < initialStock
          ? { ...option, quantity: option.quantity + 1 }
          : option,
      ),
    );
  }, []);

  const decrementQuantity = useCallback((size: number) => {
    setSelectedOptions((prev) =>
      prev.map((option) =>
        option.size === size && option.quantity > 1
          ? { ...option, quantity: option.quantity - 1 }
          : option,
      ),
    );
  }, []);

  const resetSelectedOptions = () => {
    setSelectedOptions([]);
  };

  return {
    data: {
      selectedOptions,
      totalQuantity,
      inventory,
    },
    func: {
      selectSize,
      deleteOption,
      incrementQuantity,
      decrementQuantity,
      resetSelectedOptions,
    },
  };
}
