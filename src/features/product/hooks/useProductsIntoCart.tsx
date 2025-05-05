import { useCartItemMutation } from '@/features/cart';
import type { CartListPayload } from '@/features/cart';

export default function useProductsIntoCart({
  optionPayload,
  resetOptions,
}: {
  optionPayload: CartListPayload;
  resetOptions: () => void;
}) {
  const { mutate: mutateCart, isPending: isMutatingCart } =
    useCartItemMutation();

  const handleCartButton = () => {
    mutateCart(optionPayload);

    resetOptions();
  };

  return { handleCartButton, isMutatingCart };
}
