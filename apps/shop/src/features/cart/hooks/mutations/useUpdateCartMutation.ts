import { cartQueries, updateCartQuantity } from '@/features/cart';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ cartItemId, quantity }) => {
      const previousCart = queryClient.getQueryData<CartList>(
        cartQueries.list().queryKey,
      );

      queryClient.setQueryData(cartQueries.list().queryKey, (old: CartList) =>
        old.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
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
