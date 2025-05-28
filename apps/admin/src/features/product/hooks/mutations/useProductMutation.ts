import { postProduct } from '@/features/product';
import { useMutation } from '@tanstack/react-query';

export function useProductMutation() {
  return useMutation({
    mutationFn: postProduct,
  });
}
