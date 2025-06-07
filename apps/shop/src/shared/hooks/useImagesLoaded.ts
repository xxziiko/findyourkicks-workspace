'use client';
import { useCallback, useState } from 'react';

export function useImagesLoaded(totalCount: number) {
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoadCount = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  const allLoaded = loadedCount >= totalCount;

  return { allLoaded, handleImageLoadCount };
}
