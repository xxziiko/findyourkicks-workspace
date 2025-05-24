import { SIZES } from '@/shared/constants';
import { useCallback, useState } from 'react';

export function useOptionSize() {
  const [selectedSizes, setSelectedSizes] = useState<
    {
      size: string;
      stock: number;
    }[]
  >([]);

  const updateSelectedSizes = useCallback((size: string) => {
    setSelectedSizes((prev) => [...prev, { size, stock: 0 }]);
  }, []);

  const handleSelectAllSizes = useCallback(() => {
    if (selectedSizes.length === SIZES.length) {
      setSelectedSizes([]);
      return;
    }

    setSelectedSizes(SIZES.map((size) => ({ size, stock: 0 })));
  }, [selectedSizes]);

  const handleChangeSelectedSizes = useCallback(
    (size: string, stock: number) => {
      setSelectedSizes((prev) =>
        prev.map((selectedSize) =>
          selectedSize.size === size
            ? { ...selectedSize, stock }
            : selectedSize,
        ),
      );
    },
    [],
  );

  const handleApplyAllStock = useCallback((stock: number) => {
    setSelectedSizes((prev) =>
      prev.map((selectedSize) => ({ ...selectedSize, stock })),
    );
  }, []);

  const deleteSelectedSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.filter((selectedSize) => selectedSize.size !== size),
    );
  }, []);

  return {
    selectedSizes,
    updateSelectedSizes,
    handleSelectAllSizes,
    handleChangeSelectedSizes,
    handleApplyAllStock,
    deleteSelectedSize,
  };
}
