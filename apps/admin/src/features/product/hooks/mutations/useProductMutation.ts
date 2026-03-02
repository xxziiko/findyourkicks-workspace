import { postProduct } from '@/features/product';
import { useMutation } from '@tanstack/react-query';

export function useProductMutation({
  onSuccess,
  onError,
}: { onSuccess: () => void; onError?: (error: unknown) => void }) {
  return useMutation({
    mutationFn: postProduct,
    onSuccess,
    onError: (error) => {
      console.error(
        '[useProductMutation] failed:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      onError?.(error);
    },
  });
}
