import { uploadImage } from '@/features/product';
import { useMutation } from '@tanstack/react-query';

export function useImageMutation() {
  return useMutation({
    mutationFn: uploadImage,
    onError: (error) => {
      console.error(
        '[useImageMutation] failed:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    },
  });
}
