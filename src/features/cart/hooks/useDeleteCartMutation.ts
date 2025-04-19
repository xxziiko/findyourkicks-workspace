import { cartKeys, deleteCartItem } from '@/features/cart';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (cartItemId) => {
      const previousCart = queryClient.getQueryData<CartList>(cartKeys.list());

      queryClient.setQueryData(cartKeys.list(), (old: CartList) =>
        old.filter((item) => item.cartItemId !== cartItemId),
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<CartList>(
        cartKeys.list(),
        context?.previousCart,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}
