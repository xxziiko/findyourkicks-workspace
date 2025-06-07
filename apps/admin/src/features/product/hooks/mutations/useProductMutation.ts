import { postProduct } from '@/features/product';
import { useMutation } from '@tanstack/react-query';

export function useProductMutation({ onSuccess }: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: postProduct,
    onSuccess,
  });
}
