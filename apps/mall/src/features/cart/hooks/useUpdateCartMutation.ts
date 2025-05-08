import { cartKeys, updateCartQuantity } from '@/features/cart';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ cartItemId, quantity }) => {
      const previousCart = queryClient.getQueryData<CartList>(cartKeys.list());

      queryClient.setQueryData(cartKeys.list(), (old: CartList) =>
        old.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
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
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
}
