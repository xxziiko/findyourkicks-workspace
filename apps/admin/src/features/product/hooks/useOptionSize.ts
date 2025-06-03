import { SIZES } from '@/shared/constants';
import { type ChangeEvent, useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

export function useOptionSize() {
  const isAllSelected = useCallback(
    (field: FieldValues) => field.value.length === SIZES.length,
    [],
  );

  const updateSelectedSizes = useCallback(
    (size: string, field: FieldValues) => {
      field.onChange([...field.value, { size, stock: 0 }]);
    },
    [],
  );

  const handleSelectAllSizes = useCallback(
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

  const deleteSelectedSize = useCallback((size: string, field: FieldValues) => {
    field.onChange(
      field.value.filter(
        (selectedSize: { size: string }) => selectedSize.size !== size,
      ),
    );
  }, []);

  return {
    updateSelectedSizes,
    handleSelectAllSizes,
    handleSizeChange,
    handleAllStockChange,
    deleteSelectedSize,
    isAllSelected,
  };
}
