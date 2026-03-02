import { addToCart, cartQueries } from '@/features/cart';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueries.list().queryKey });
      queryClient.invalidateQueries({ queryKey: cartQueries.count().queryKey });
    },
  });
}
