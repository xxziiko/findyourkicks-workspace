import type { CartItem } from '@/app/api/cart/route';
import { updateCartQuantity } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ cartItemId, quantity }) => {
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']);

      queryClient.setQueryData(['cart'], (old: CartItem[]) =>
        old.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
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
