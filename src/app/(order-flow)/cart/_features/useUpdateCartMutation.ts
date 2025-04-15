import { updateCartQuantity } from '@/features/cart/apis';
import type { CartList } from '@/features/cart/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ cartItemId, quantity }) => {
      const previousCart = queryClient.getQueryData<CartList>(['cart']);

      queryClient.setQueryData(['cart'], (old: CartList) =>
        old.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
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
