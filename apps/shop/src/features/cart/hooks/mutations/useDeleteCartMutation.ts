import { cartQueries, deleteCartItem } from '@/features/cart';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (cartItemId) => {
      const previousCart = queryClient.getQueryData<CartList>(
        cartQueries.list().queryKey,
      );

      queryClient.setQueryData(cartQueries.list().queryKey, (old: CartList) =>
        old.filter((item) => item.cartItemId !== cartItemId),
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<CartList>(
        cartQueries.list().queryKey,
        context?.previousCart,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueries.list().queryKey });
      queryClient.invalidateQueries({ queryKey: cartQueries.count().queryKey });
    },
  });
}
