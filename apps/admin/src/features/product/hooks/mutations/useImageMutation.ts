import { uploadImage } from '@/features/product';
import { useMutation } from '@tanstack/react-query';

export function useImageMutation() {
  return useMutation({
    mutationFn: uploadImage,
  });
}
