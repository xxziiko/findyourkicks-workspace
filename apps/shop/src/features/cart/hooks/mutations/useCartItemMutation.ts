import { addToCart } from '@/features/cart';
import { useMutation } from '@tanstack/react-query';

export function useCartItemMutation() {
  return useMutation({
    mutationFn: addToCart,
  });
}
