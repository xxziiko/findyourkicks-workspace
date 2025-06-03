'use client';

import { type ChangeEvent, useCallback, useState } from 'react';

const getImagePreviews = async (
  e: React.ChangeEvent<HTMLInputElement>,
  maxCount: number,
) => {
  const files = e.target.files;
  if (!files) return;

  const fileArray = Array.from(files);

  const previews = await Promise.all(
    fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }),
  );

  if (previews.length > maxCount) {
    alert(`최대 ${maxCount}개의 이미지를 업로드할 수 있습니다.`);
    return previews.slice(0, maxCount);
  }

  return previews;
};

/**
 * @param maxCount 최대 이미지 개수
 * @returns 이미지 미리보기 배열, 이미지 제거 함수, 이미지 미리보기 함수
 */
export function useImagePreview({
  maxCount = 1,
}: {
  maxCount?: number;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newPreviews = await getImagePreviews(e, maxCount);
      if (!newPreviews) return;

      if (maxCount === 1) {
        setPreviews([newPreviews[0]]);
        return;
      }

      setPreviews(newPreviews);
    },
    [maxCount],
  );

  const removeFile = useCallback((index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetPreviews = useCallback(() => {
    setPreviews([]);
  }, []);

  return {
    previews,
    removeFile,
    handleImageInputChange,
    resetPreviews,
  };
}
