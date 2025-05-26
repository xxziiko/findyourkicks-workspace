import { useCallback, useRef } from 'react';

export function useFileInputTrigger() {
  const ref = useRef<HTMLInputElement>(null);

  const triggerClick = useCallback(() => {
    ref.current?.click();
  }, []);

  return {
    ref,
    triggerClick,
  };
}
