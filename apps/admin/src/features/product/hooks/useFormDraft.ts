import type { ProductForm } from '@/features/product';
import { debounce } from 'es-toolkit';
import { useCallback, useEffect, useState } from 'react';

export function useFormDraft({
  getValues,
  watch,
}: {
  getValues: () => ProductForm;
  watch: (callback: (data: ProductForm) => void) => { unsubscribe: () => void };
}) {
  const [savedTime, setSavedTime] = useState<string>('');

  const debouncedSave = useCallback(
    debounce((data: Partial<ProductForm>) => {
      localStorage.setItem('draft', JSON.stringify(data));

      setSavedTime(new Date().toISOString());
    }, 2000),
    [],
  );

  const handleDraftToLocal = useCallback(
    () => debouncedSave(getValues()),
    [debouncedSave, getValues],
  );

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSave(data as ProductForm);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return { savedTime, handleDraftToLocal };
}
