import { useCallback, useState } from 'react';

export default function useImagesLoaded(totalCount: number) {
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  const allLoaded = loadedCount >= totalCount;

  return { allLoaded, handleImageLoad };
}
