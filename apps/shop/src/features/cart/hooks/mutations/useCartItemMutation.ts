import { addToCart, cartKeys } from '@/features/cart';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
}
