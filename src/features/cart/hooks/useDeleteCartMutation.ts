import { deleteCartItem } from '@/features/cart/apis';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (cartItemId) => {
      const previousCart = queryClient.getQueryData<CartList>(['cart']);

      queryClient.setQueryData(['cart'], (old: CartList) =>
        old.filter((item) => item.cartItemId !== cartItemId),
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<CartList>(['cart'], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
