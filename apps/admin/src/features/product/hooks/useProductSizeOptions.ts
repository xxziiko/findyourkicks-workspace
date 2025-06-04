import { SIZES } from '@/shared/constants';
import { type ChangeEvent, useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

export function useProductSizeOptions() {
  const isAllSelected = useCallback(
    (field: FieldValues) => field.value.length === SIZES.length,
    [],
  );

  const handleAddSizeOption = useCallback(
    (size: string, field: FieldValues) => {
      field.onChange([...field.value, { size, stock: 0 }]);
    },
    [],
  );

  const handleToggleAllSizes = useCallback(
    (field: FieldValues) => {
      if (isAllSelected(field)) {
        field.onChange([]);
        return;
      }

      field.onChange(SIZES.map((size) => ({ size, stock: 0 })));
    },
    [isAllSelected],
  );

  const handleAllStockChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: FieldValues) => {
      const stock = Number(e.target.value);
      field.onChange(
        field.value.map((selectedSize: { size: string }) => ({
          ...selectedSize,
          stock,
        })),
      );
    },
    [],
  );

  const handleSizeChange = useCallback(
    (size: string, stock: number, field: FieldValues) => {
      field.onChange(
        field.value.map((selectedSize: { size: string }) =>
          selectedSize.size === size
            ? { ...selectedSize, stock }
            : selectedSize,
        ),
      );
    },
    [],
  );

  const handleRemoveSizeOption = useCallback(
    (size: string, field: FieldValues) => {
      field.onChange(
        field.value.filter(
          (selectedSize: { size: string }) => selectedSize.size !== size,
        ),
      );
    },
    [],
  );

  return {
    handleAddSizeOption,
    handleToggleAllSizes,
    handleSizeChange,
    handleAllStockChange,
    handleRemoveSizeOption,
    isAllSelected,
  };
}
