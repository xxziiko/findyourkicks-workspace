import type { CartItem } from '@/app/api/cart/route';
import { deleteCartItem } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (cartItemId) => {
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']);

      queryClient.setQueryData(['cart'], (old: CartItem[]) =>
        old.filter((item) => item.cartItemId !== cartItemId),
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<CartItem[]>(['cart'], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
