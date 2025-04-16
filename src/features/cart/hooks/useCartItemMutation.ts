import { addToCart } from '@/features/cart';
import { cartKeys } from '@/features/cart';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      console.log('onSuccess');
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}
