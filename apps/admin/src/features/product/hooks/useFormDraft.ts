import type { ProductRegisterForm } from '@/features/product';
import { debounce } from 'es-toolkit';
import { useCallback, useEffect, useState } from 'react';

export function useFormDraft({
  getValues,
  watch,
}: {
  getValues: () => ProductRegisterForm;
  watch: (callback: (data: ProductRegisterForm) => void) => { unsubscribe: () => void };
}) {
  const [savedTime, setSavedTime] = useState<string>('');

  const debouncedSave = useCallback(
    debounce((data: Partial<ProductRegisterForm>) => {
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
      debouncedSave(data as ProductRegisterForm);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return { savedTime, handleDraftToLocal };
}
